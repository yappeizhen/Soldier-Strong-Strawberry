import numpy as np
import cv2
from mss import mss
from PIL import Image
import mediapipe as mp
import PoseModule as pm

import ctypes
user32 = ctypes.windll.user32
screensize = user32.GetSystemMetrics(0), user32.GetSystemMetrics(1)
screensize

#bounding_box = {'top': 100, 'left': 0, 'width': 400, 'height': 300}
bounding_box = {'top': 0, 'left': 0, 'width': screensize[0]//2, 'height': screensize[1]*2//3}

sct = mss()

# 1. New detection variables
sequence = []
sentence = []
predictions = []
threshold = 0.5

#import pafy
#import cv2
#url = "https://www.youtube.com/watch?v=jcnSKdZFr-M&ab_channel=ASLTHAT"
#video = pafy.new(url)
#best = video.getbest(preftype="mp4")
#cap = cv2.VideoCapture(best.url)
#cap = cv2.VideoCapture('./gif/combined.mp4')
import pafy
import cv2

url = "https://www.youtube.com/watch?v=eIP20t1ltmY&ab_channel=TrueFitness"
#url = "https://youtu.be/eIP20t1ltmY?t=18"
video = pafy.new(url)
#best = video.getbest(preftype="mp4")
best = video.getbest()
#cap = cv2.VideoCapture(best.url)
cap = cv2.VideoCapture("video_2022-06-14_01-43-52.mp4")
#Asking the user for video start time and duration in seconds
milliseconds = 1000
start_time = 3 #int(input("Enter Start time: "))
end_time = 49 #int(input("Enter Length: "))
end_time = start_time + end_time
# Passing the start and end time for CV2
cap.set(cv2.CAP_PROP_POS_MSEC, start_time*milliseconds)
fourcc = cv2.VideoWriter_fourcc('X','V','I','D')
fourcc = cv2.VideoWriter_fourcc(*'MP4V')
videoWriter = cv2.VideoWriter('mh_pushup_demo.mp4', fourcc, 30.0, (1280, 720))

cap.set(3,1280)
cap.set(4,720)

#cap = cv2.VideoCapture(0)
detector = pm.poseDetector()
count = 0
direction = 0
form = 0
feedback = "Fix Form"
count_status = ''
# Set mediapipe model 
while cap and cap.get(cv2.CAP_PROP_POS_MSEC)<=end_time*milliseconds:
    grabbed, img = cap.read()
    img = cv2.resize(img, (1280, 720)) 
#while cap:
    #sct_img = sct.grab(bounding_box)
    #img = np.array(sct_img)

    # Make detections
    #image, results = mediapipe_detection(image, pose)
    #draw_styled_landmarks(image, results)

    #Determine dimensions of video - Help with creation of box in Line 43
    #width  = #cap.get(3)  # float `width`
    #height = #cap.get(4)  # float `height`
    width = img.shape[1]#480
    height= img.shape[0]#640
    # print(width, height)
    
    img = detector.findPose(img, False)
    lmList = detector.findPosition(img, False)

    # print(lmList)
    if len(lmList) != 0:
        
        # check if visibility of left or right keypoints is more prominent
        left_landmark_index = [15,13,11,23,25,27]
        right_landmark_index = [16,14,12,24,26,28]
        left_visibility_sum = 0
        right_visibility_sum = 0
        for index in left_landmark_index:
            left_visibility_sum += lmList[index][1] #add visibility score
        for index in right_landmark_index:
            right_visibility_sum += lmList[index][1] #add visibility score

        # Predict on left side of body (more visible)
        if left_visibility_sum > right_visibility_sum:
            elbow = detector.findAngle(img, 11, 13, 15)
            shoulder = detector.findAngle(img, 13, 11, 23)
            hip = detector.findAngle(img, 11, 23,25)
            knee = detector.findAngle(img,23,25,27)
            elbow_points = lmList[13]
            hip_points = lmList[23]
            knee_points = lmList[25]

        # Predict on right side of body (more visible)
        else:
            elbow = detector.findAngle(img, 12, 14, 16)
            shoulder = detector.findAngle(img, 14, 12, 24)
            hip = detector.findAngle(img, 12, 24,26)
            knee = detector.findAngle(img,24,26,28)
            elbow_points = lmList[14]
            hip_points = lmList[24]
            knee_points = lmList[26]
        
        
        #Percentage of success of pushup
        # xcoordinates range to consider as full range of motion ( <90 to >160 degrees)
        per = np.interp(elbow, (90, 157), (0, 100))
        
        #Bar to show Pushup progress
        bar = np.interp(elbow, (90, 157), (380, 50))

        #Check to ensure right form before starting the program
        if elbow > 160 and shoulder > 40 and (hip > 165 and hip < 190) and knee > 170:
            form = 1
        
        #Check for full range of motion for the pushup
        if form == 1:
            if per == 0: # reaching bottom position of push up
                
                if elbow <= 90 and (hip > 165 and hip < 190) and knee > 165:
                    count_status = ''
                    feedback = "GO UP"
                    if direction == 0:
                        #count += 0.5
                        direction = 1
                        count_status = ''
                    else:
                        count_status = 'NO COUNT'

                elif elbow > 90:
                    feedback = "LOWER BODY"
                    count_status = 'NO COUNT'

                elif hip <= 165 or hip >= 190:
                    feedback = "STRAIGHTEN BACK"
                    count_status = 'NO COUNT'
                    cv2.circle(img, (hip_points[2], hip_points[3]), 5, (0,0,255), cv2.FILLED)
                    cv2.circle(img, (hip_points[2], hip_points[3]), 15, (0,0,255), 2)

                elif knee <= 170:
                    feedback = "STRAIGHTEN KNEE"
                    count_status = 'NO COUNT'
                    cv2.circle(img, (knee_points[2], knee_points[3]), 5, (0,0,255), cv2.FILLED)
                    cv2.circle(img, (knee_points[2], knee_points[3]), 15, (0,0,255), 2)
                #else:
                    #feedback = "Fix Form"
                    #count_status = 'NO COUNT'
                    
            if per == 100: # reaching top position of push up
                if elbow > 160 and shoulder > 40 and (hip > 165 and hip < 190) and knee > 170:
                    count_status = ''
                    feedback = "GO DOWN"
                    if direction == 1:
                        count += 1 # increase count when 1 pushup is complete
                        #count += 0.5
                        direction = 0
                        count_status = ''
                    else:
                        count_status = 'NO COUNT'

                
                elif elbow <= 160:
                    feedback = "STRAIGHTEN ELBOWS"
                    count_status = 'NO COUNT'
                    cv2.circle(img, (elbow_points[2], elbow_points[3]), 5, (0,0,255), cv2.FILLED)
                    cv2.circle(img, (elbow_points[2], elbow_points[3]), 15, (0,0,255), 2)
                elif hip <= 165 or hip >= 190:
                    feedback = "STRAIGHTEN BACK"
                    count_status = 'NO COUNT'
                    cv2.circle(img, (hip_points[2], hip_points[3]), 5, (0,0,255), cv2.FILLED)
                    cv2.circle(img, (hip_points[2], hip_points[3]), 15, (0,0,255), 2)
                elif knee <= 170:
                    feedback = "STRAIGHTEN KNEE"
                    count_status = 'NO COUNT'
                    cv2.circle(img, (knee_points[2], knee_points[3]), 5, (0,0,255), cv2.FILLED)
                    cv2.circle(img, (knee_points[2], knee_points[3]), 15, (0,0,255), 2)

                #else:
                    #feedback = "Fix Form"
                    #count_status = 'NO COUNT'


        #print(count)
    
    #Draw Pushup Progress Bar
    if form == 1:
        cv2.rectangle(img, (width-70, 50), (width-30, 380), (0, 255, 0), 3)
        cv2.rectangle(img, (width-70, int(bar)), (width-30, 380), (0, 255, 0), cv2.FILLED)
        cv2.putText(img, f'{int(per)}%', (width-80, 430), cv2.FONT_HERSHEY_PLAIN, 2,
                    (0, 0, 255), 2)

    #Pushup counter
    cv2.rectangle(img, (width-120, height), (width, height-80), (255, 255, 255), cv2.FILLED)
    cv2.putText(img, str(int(count)), (width-120, height-10), cv2.FONT_HERSHEY_PLAIN, 5,
                (0, 0, 255), 5)
    
    #Feedback 
    cv2.rectangle(img, (width//2-200, 0), (width//2 + 200, 40), (255, 255, 255), cv2.FILLED)
    cv2.putText(img, feedback, (width//2 - 200, 35), cv2.FONT_HERSHEY_PLAIN, 2,
                (0, 0, 255), 2)
    
    #Count Status
    cv2.rectangle(img, (width//2-200, 40), (width//2 + 200, 80), (255, 255, 255), cv2.FILLED)
    cv2.putText(img, count_status, (width//2 - 200, 75), cv2.FONT_HERSHEY_PLAIN, 2,
                (0, 0, 255), 2)

    cv2.imshow('screen capture', img)
    videoWriter.write(img)
    if (cv2.waitKey(1) & 0xFF) == ord('q'):
        cv2.destroyAllWindows()
        break
    
cap.release() #release webcam
videoWriter.release()            
cv2.destroyAllWindows()