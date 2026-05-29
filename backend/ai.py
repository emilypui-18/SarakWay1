import cv2
import requests
import numpy as np
from ultralytics import YOLO
import mediapipe as mp
import math
import tkinter as tk
from tkinter import ttk
from PIL import Image, ImageTk

from collections import deque
import datetime
import os

# =========================================================
# SYSTEM CONFIGURATION
# =========================================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SEG_MODEL_PATH = os.path.join(BASE_DIR, "models", "best.pt")
CONF_THRESHOLD = 0.6

# =========================================================
# CLASS-BASED AI ENGINE AND INTERACTION MANAGEMENT
# =========================================================
class PlantProtectionApp:
    def __init__(self, window, window_title):
        self.window = window
        self.window.title(window_title)
        self.window.geometry("1400x850")
        self.window.configure(bg="#1e1e24")

        # Load Models and AI Assets
        print("Loading YOLO Instance Segmentation Model...")
        self.seg_model = YOLO(SEG_MODEL_PATH)
        
        # Initialize MediaPipe Solutions
        self.mp_pose = mp.solutions.pose
        self.mp_hands = mp.solutions.hands
        self.mp_draw = mp.solutions.drawing_utils
        
        self.pose = self.mp_pose.Pose()
        self.hands = self.mp_hands.Hands(
            max_num_hands=2,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )

        # Initialize Video Source Capture Feed
        self.cap = cv2.VideoCapture(0)
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

        # =========================================================
        # SMART EVENT RECORDING SYSTEM
        # =========================================================

        # Folder to store incident clips
        self.output_dir = "incident_recordings"
        os.makedirs(self.output_dir, exist_ok=True)

        # Temporary rolling frame memory buffer
        self.frame_buffer = deque(maxlen=150)  
        # ~5 seconds if webcam runs near 30 FPS

        # Recording states
        self.is_recording = False
        self.violation_confirmed = False

        # Video writer object
        self.video_writer = None

        # Frames since last violation detected
        self.frames_since_violation = 0

        # Interaction persistence counter
        self.interaction_frames = 0

        # Require ~0.5 sec interaction before recording
        self.interaction_threshold = 15

        # How long to continue recording after violation disappears
        self.recording_cooldown_frames = 90
        # ~3 seconds

        # Setup Layout Frames
        self.create_layout()

        # Begin System Runtime Loop
        self.is_running = True
        self.update_frame()

        # Handle Clean Closures
        self.window.protocol("WM_DELETE_WINDOW", self.on_closing)

    def create_layout(self):
            """Creates a clean, responsive layout where the control panel is preserved."""
            # Top Banner Indicator Section Area
            self.banner_frame = tk.Frame(self.window, bg="#2a2a35", height=60)
            self.banner_frame.pack(fill=tk.X, side=tk.TOP)
            
            self.system_title = tk.Label(
                self.banner_frame, 
                text="HYBRID AI PLANT PROTECTION REALTIME DASHBOARD", 
                font=("Helvetica", 14, "bold"), 
                fg="#ffffff", 
                bg="#2a2a35"
            )
            self.system_title.pack(pady=15)

            # Main Center Working Workspace
            self.main_container = tk.Frame(self.window, bg="#1e1e24")
            self.main_container.pack(fill=tk.BOTH, expand=True, padx=20, pady=20)

            # FIX 1: Pack the Right Control Panel FIRST so it secures its space
            self.control_panel = tk.Frame(self.main_container, bg="#2a2a35", width=320, bd=1, relief=tk.SOLID)
            self.control_panel.pack(side=tk.RIGHT, fill=tk.Y, padx=(20, 0))
            self.control_panel.pack_propagate(False) # Keep fixed width intact

            # Left Video Stream Panel Display (Fills remaining space)
            self.video_frame = tk.Frame(self.main_container, bg="#000000", bd=2, relief=tk.SOLID)
            self.video_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)

            self.video_label = tk.Label(self.video_frame, bg="#000000")
            self.video_label.pack(fill=tk.BOTH, expand=True)

            # Dashboard Visual Text Status Gauges
            tk.Label(self.control_panel, text="SYSTEM VOLUMETRICS", font=("Helvetica", 12, "bold"), fg="#a0a0b2", bg="#2a2a35").pack(pady=(20, 10))
            
            self.status_var = tk.StringVar(value="SYSTEM INITIALIZING")
            self.status_card = tk.Label(
                self.control_panel, 
                textvariable=self.status_var, 
                font=("Helvetica", 12, "bold"), 
                fg="#00ff00", 
                bg="#1e1e24", 
                width=22, 
                pady=15,
                bd=1,
                relief=tk.SUNKEN
            )
            self.status_card.pack(pady=10, padx=15)

            # Separation Divider Horizontal
            ttk.Separator(self.control_panel, orient='horizontal').pack(fill='x', padx=15, pady=15)

            # FIX 3: Cleaned up shutdown button configuration to ensure cross-platform click stability
            self.exit_btn = tk.Button(
                self.control_panel, 
                text="SHUTDOWN SYSTEM", 
                command=self.on_closing, 
                font=("Helvetica", 11, "bold"), 
                bg="#ff3333", 
                fg="#000000",
                highlightbackground="#2a2a35", # Matches control panel on macOS
                activebackground="#cc0000",
                activeforeground="#ffffff",
                relief=tk.RAISED,
                pady=10
            )
            self.exit_btn.pack(side=tk.BOTTOM, fill=tk.X, padx=15, pady=20)

    # =========================================================
    # CORE MATH INTERACTION EXTRACTOR METHODS
    # =========================================================
    def get_dist(self, p1, p2):
        return math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2)

    def detect_gestures(self, hand_lms):
        t_tip = hand_lms.landmark[4]
        i_tip = hand_lms.landmark[8]
        m_tip = hand_lms.landmark[12]
        r_tip = hand_lms.landmark[16]
        p_tip = hand_lms.landmark[20]
        i_mcp = hand_lms.landmark[5]
        m_mcp = hand_lms.landmark[9]
        r_mcp = hand_lms.landmark[13]
        p_mcp = hand_lms.landmark[17]
        wrist = hand_lms.landmark[0]

        def dist_from_wrist(pt):
            return math.sqrt((pt.x - wrist.x) ** 2 + (pt.y - wrist.y) ** 2)

        i_folded = dist_from_wrist(i_tip) < dist_from_wrist(i_mcp)
        m_folded = dist_from_wrist(m_tip) < dist_from_wrist(m_mcp)
        r_folded = dist_from_wrist(r_tip) < dist_from_wrist(r_mcp)
        p_folded = dist_from_wrist(p_tip) < dist_from_wrist(p_mcp)

        dist_pinch = self.get_dist(i_tip, t_tip)
        dist_pluck = (self.get_dist(i_tip, t_tip) + self.get_dist(m_tip, t_tip) + self.get_dist(r_tip, t_tip) + self.get_dist(p_tip, t_tip)) / 4

        if i_folded and m_folded and r_folded and p_folded: return "FIST"
        if dist_pluck < 0.06: return "PLUCK GRIP"
        if dist_pinch < 0.04: return "PINCH"
        return "OPEN"

    # =========================================================
    # RUNTIME MONITOR FRAMERATE PIPELINING LOOP
    # =========================================================
    def update_frame(self):
        if not self.is_running:
            return

        ret, frame = self.cap.read()
        if not ret:
            print("Failed to read frame.")
            self.window.after(10, self.update_frame)
            return

        frame = cv2.flip(frame, 1)
        h, w, _ = frame.shape
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # Run Segmentation Inference
        seg_results = self.seg_model.predict(source=frame, conf=CONF_THRESHOLD, verbose=False)[0]
        annotated_frame = seg_results.plot()
        # Store latest annotated frame into rolling memory buffer
        self.frame_buffer.append(annotated_frame.copy())
        
        plant_polygons = []
        animal_polygons = []

        plant_boxes = []
        animal_boxes = []

        # =========================================================
        # CLASS-AWARE DETECTION PARSER
        # =========================================================

        plant_polygons = []
        animal_polygons = []

        plant_boxes = []
        animal_boxes = []

        if getattr(seg_results, "masks", None) is not None and seg_results.masks is not None:

            for i, mask in enumerate(seg_results.masks.xy):

                cls_id = int(seg_results.boxes.cls[i])
                class_name = self.seg_model.names[cls_id]

                poly = np.array(mask, dtype=np.int32).reshape((-1, 1, 2))

                if class_name == "plant":
                    plant_polygons.append(poly)
                    cv2.polylines(annotated_frame, [poly], True, (0, 255, 0), 2)

                elif class_name == "animal":
                    animal_polygons.append(poly)
                    cv2.polylines(annotated_frame, [poly], True, (0, 165, 255), 2)

        elif getattr(seg_results, "boxes", None) is not None and seg_results.boxes is not None:

            for i, box in enumerate(seg_results.boxes):

                cls_id = int(box.cls[0])
                class_name = self.seg_model.names[cls_id]

                x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())

                if class_name == "plant":
                    plant_boxes.append((x1, y1, x2, y2))

                elif class_name == "animal":
                    animal_boxes.append((x1, y1, x2, y2))

        # Run Pose Inference
        pose_results = self.pose.process(rgb_frame)
        if pose_results.pose_landmarks:
            self.mp_draw.draw_landmarks(annotated_frame, pose_results.pose_landmarks, self.mp_pose.POSE_CONNECTIONS)

        # Process Independent Hand Structures
        hand_results = self.hands.process(rgb_frame)
        frame_has_violation = False

        finger_inside_plant = False
        finger_inside_animal = False

        if hand_results.multi_hand_landmarks:
            for hand_landmarks in hand_results.multi_hand_landmarks:
                self.mp_draw.draw_landmarks(annotated_frame, hand_landmarks, self.mp_hands.HAND_CONNECTIONS)
                this_hand_gesture = self.detect_gestures(hand_landmarks)

                index_tip = hand_landmarks.landmark[self.mp_hands.HandLandmark.INDEX_FINGER_TIP]
                ix, iy = int(index_tip.x * w), int(index_tip.y * h)

                finger_inside_plant = False
                finger_inside_animal = False

                if len(plant_polygons) > 0:
                    for poly in plant_polygons:
                        reshaped_poly = poly.reshape((-1, 2))
                        if cv2.pointPolygonTest(reshaped_poly, (ix, iy), False) >= 0:
                            finger_inside_plant = True
                            break
                else:
                    for (x1, y1, x2, y2) in plant_boxes:
                        if x1 <= ix <= x2 and y1 <= iy <= y2:
                            finger_inside_plant = True
                            break
                
                if len(animal_polygons) > 0:

                    for poly in animal_polygons:

                        reshaped_poly = poly.reshape((-1, 2))

                        if cv2.pointPolygonTest(reshaped_poly, (ix, iy), False) >= 0:
                            finger_inside_animal = True
                            break

                else:

                    for (x1, y1, x2, y2) in animal_boxes:

                        if x1 <= ix <= x2 and y1 <= iy <= y2:
                            finger_inside_animal = True
                            break

                is_malicious = this_hand_gesture in ["PINCH", "FIST", "PLUCK GRIP"]

                # =========================================================
                # PROXIMITY-TRIGGERED RECORDING
                # =========================================================

                if (finger_inside_plant or finger_inside_animal):

                    self.interaction_frames += 1

                else:
                    self.interaction_frames = 0

                # Start recording only after stable interaction
                if self.interaction_frames > self.interaction_threshold and not self.is_recording:

                    print("Conservation violation detected. Starting evidence recording...")

                    self.is_recording = True
                    self.violation_confirmed = False
                    self.frames_since_violation = 0

                    # Generate timestamp filename
                    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")

                    self.current_video_path = os.path.join(
                        self.output_dir,
                        f"temp_event_{timestamp}.mp4"
                    )

                    # Video writer codec setup
                    fourcc = cv2.VideoWriter_fourcc(*'mp4v')

                    self.video_writer = cv2.VideoWriter(
                        self.current_video_path,
                        fourcc,
                        20.0,
                        (w, h)
                    )

                    # Dump buffered frames into recording first
                    for buffered_frame in self.frame_buffer:
                        self.video_writer.write(buffered_frame)
                
                elif (finger_inside_plant or finger_inside_animal):

                    frame_has_violation = False

                    self.status_var.set("🟡 MONITORING INTERACTION")
                    self.status_card.configure(fg="#ffcc00", bg="#2d2a14")
                                    
                if (finger_inside_plant or finger_inside_animal) and is_malicious:
                    self.violation_confirmed = True
                    self.frames_since_violation = 0

                    frame_has_violation = True
                    cursor_color = (0, 0, 255)
                    cv2.circle(annotated_frame, (ix, iy), 16, (0, 0, 255), -1)
                elif (finger_inside_plant or finger_inside_animal) and this_hand_gesture == "OPEN":
                    cursor_color = (0, 255, 0)
                    cv2.circle(annotated_frame, (ix, iy), 16, (0, 255, 0), -1)
                else:
                    cursor_color = (255, 255, 255)

                cv2.circle(annotated_frame, (ix, iy), 10, cursor_color, -1)
                
                wrist = hand_landmarks.landmark[0]
                wx, wy = int(wrist.x * w), int(wrist.y * h)
                cv2.putText(annotated_frame, this_hand_gesture, (wx - 40, wy + 30), cv2.FONT_HERSHEY_SIMPLEX, 0.6, cursor_color, 2)

        # =========================================================
        # CONTINUOUS RECORDING PIPELINE
        # =========================================================

        if self.is_recording and self.video_writer is not None:

            # =========================================================
            # RECORDING VISUAL INDICATOR
            # =========================================================

            cv2.circle(annotated_frame, (40, 40), 15, (0, 0, 255), -1)

            cv2.putText(
                annotated_frame,
                "RECORDING",
                (70, 50),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.9,
                (0, 0, 255),
                3
            )

            self.video_writer.write(annotated_frame)

        # =========================================================
        # SMART RECORDING STOP / CLEANUP SYSTEM
        # =========================================================

        interaction_active = (
            finger_inside_plant or
            finger_inside_animal
        )

        if self.is_recording:

            if interaction_active:
                self.frames_since_violation = 0
            else:
                self.frames_since_violation += 1

            # Stop recording after cooldown period
            if self.frames_since_violation > self.recording_cooldown_frames:

                print("✅ No interaction detected for 3 seconds. Recording stopped.")

                self.is_recording = False

                if self.video_writer is not None:
                    self.video_writer.release()
                    self.video_writer = None

                # Delete harmless clips
                if not self.violation_confirmed:

                    print("No malicious action detected. Deleting clip...")

                    if os.path.exists(self.current_video_path):
                        os.remove(self.current_video_path)

                else:
                    import requests

                    url = "http://10.244.107.80:3000/ai-recordings"

                    files = {
                        "video": open(self.current_video_path, "rb")
                    }

                    data = {
                        "violation_type": "Plant Protection Violation"
                    }

                    response = requests.post(url, files=files, data=data)

                    print(response.json())

        # =========================================================
        # RENDER AND ADAPTIVE RESIZE PIPELINE
        # =========================================================
        if frame_has_violation:
            self.status_var.set("⚠️ CONSERVATION\nVIOLATION DETECTED!")
            self.status_card.configure(fg="#ff3333", bg="#2d1414")
            cv2.rectangle(annotated_frame, (0, 0), (w, h), (0, 0, 255), 12)
        else:
            self.status_var.set("✅ SECURE STATUS")
            self.status_card.configure(fg="#00ff00", bg="#142d14")

        # FIX 2: Get dynamic dimensions of the UI container and resize safely
        target_w = max(self.video_frame.winfo_width() - 4, 100)
        target_h = max(self.video_frame.winfo_height() - 4, 100)
        
        # Scale the frame smoothly to fit the UI panel area
        annotated_frame = cv2.resize(annotated_frame, (target_w, target_h), interpolation=cv2.INTER_AREA)

        # Convert OpenCV BGR Image Matrix to PIL PhotoImage format
        img_rgb = cv2.cvtColor(annotated_frame, cv2.COLOR_BGR2RGB)
        img_pil = Image.fromarray(img_rgb)
        img_tk = ImageTk.PhotoImage(image=img_pil)

        # Update Display Target Container
        self.video_label.img_tk = img_tk
        self.video_label.configure(image=img_tk)

        # Loop recursively after 10 milliseconds non-blockingly
        self.window.after(10, self.update_frame)

    def on_closing(self):
        """Cleans resources up cleanly upon system interface destruction requests."""
        print("Safely winding down worker threads and devices...")
        self.is_running = False
        self.cap.release()
        cv2.destroyAllWindows()
        self.window.destroy()

# =========================================================
# APPLICATION INSTANTIATION RUNNER entry point
# =========================================================
if __name__ == "__main__":
    root = tk.Tk()
    app = PlantProtectionApp(root, "Hybrid AI Plant Protection System Container")
    root.mainloop()