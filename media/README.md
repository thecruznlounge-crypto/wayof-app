# WAYOF exercise video demos

WAYOF lets users choose among four coach avatars in each exercise demo. It plays a **real video clip** for the Guide avatar when an exercise has one, and uses the selected illustrated human-like coach for other exercises or avatars, so realistic clips can be added gradually. The included `demos/bodyweight-squat.mp4` is a synthetic athlete demonstrating a squat; spoken form cues are played on demand by the app's “Play voice instructions” button for every move.

## How to add clips
1. Save each clip as `media/demos/<file name>` using the names in the table below.
2. Add its name, without `.mp4`, to `media/demos/index.json`, e.g. `["bodyweight-squat", "push-up"]`.
3. Upload the `media/` folder to `public_html/media/`. No code changes needed.

**Clip specs:** square 1080×1080 (or 720×720) is preferred; landscape demos are also supported and letterboxed to keep the full athlete visible. MP4 (H.264), around 4–8 seconds, one clean repetition, no audio, ideally under 2 MB. Plain light studio background, full body in frame. The included squat clip is 1280×720 and about five seconds long.
The app counts each loop as one rep for voice counting.

## Making them with AI video (Runway, Kling, Google Veo, Sora, Luma, etc.)
Keep every clip consistent by reusing **one coach description** per persona and changing only the exercise line.

**Persona descriptions** (pick one per coach, or create your own):
- **Guide:** "a fit Black woman in her 30s with shoulder-length locs, plum-purple fitted athletic t-shirt, charcoal leggings, white trainers"
- **Motivator:** "an athletic Black man in his 30s with short hair, orange performance t-shirt, black joggers, white trainers"
- **Strategist:** "a fit man in his 50s with short silver hair and a trimmed gray beard, black performance t-shirt, charcoal training pants"
- **Companion:** "a fit woman in her 30s with a brown ponytail, teal athletic top, charcoal leggings, white trainers"

**Prompt template:**
> Photorealistic fitness demonstration video, {persona}, performing one slow, controlled repetition of a **{exercise}** with perfect form, {camera}, full body visible head to toe, bright minimalist light-gray studio with a matte floor, soft even lighting, locked-off tripod camera, no camera movement, no text, no logos, no music. The final frame matches the first frame so the clip loops seamlessly. 6 seconds.

Before publishing, check every clip for correct form. AI video can produce wrong technique, extra fingers or impossible joint angles, and a bad demo can cause injuries. Have a certified trainer review them if you can.

**Rights:** use only clips you generated or licensed. Don't use footage or likenesses of real trainers or celebrities without written permission.

## File names
| Exercise | File | Equipment | Suggested camera |
|---|---|---|---|
| Bodyweight squat | `bodyweight-squat.mp4` | Bodyweight | side view |
| Reverse lunge | `reverse-lunge.mp4` | Bodyweight | side view |
| Glute bridge | `glute-bridge.mp4` | Bodyweight | side view, camera at floor level |
| Incline push-up | `incline-push-up.mp4` | Bodyweight | side view, camera at floor level |
| Push-up | `push-up.mp4` | Bodyweight | side view, camera at floor level |
| Pike push-up | `pike-push-up.mp4` | Bodyweight | side view |
| Prone Y-T raise | `prone-y-t-raise.mp4` | Bodyweight | side view |
| Forearm plank | `forearm-plank.mp4` | Bodyweight | side view, camera at floor level |
| Dead bug | `dead-bug.mp4` | Bodyweight | side view, camera at floor level |
| Bird dog | `bird-dog.mp4` | Bodyweight | side view, camera at floor level |
| Brisk walking intervals | `brisk-walking-intervals.mp4` | Bodyweight | three-quarter front view |
| Low-impact cardio circuit | `low-impact-cardio-circuit.mp4` | Bodyweight | three-quarter front view |
| Standing mobility flow | `standing-mobility-flow.mp4` | Bodyweight | side view |
| Hip flexor stretch | `hip-flexor-stretch.mp4` | Bodyweight | side view |
| Yoga flow | `yoga-flow.mp4` | Exercise mat | side view |
| Cat-cow & thoracic rotation | `cat-cow-and-thoracic-rotation.mp4` | Exercise mat | side view, camera at floor level |
| Goblet squat | `goblet-squat.mp4` | Dumbbells | side view |
| Dumbbell Romanian deadlift | `dumbbell-romanian-deadlift.mp4` | Dumbbells | side view |
| Dumbbell floor press | `dumbbell-floor-press.mp4` | Dumbbells | side view |
| Dumbbell shoulder press | `dumbbell-shoulder-press.mp4` | Dumbbells | side view |
| One-arm dumbbell row | `one-arm-dumbbell-row.mp4` | Dumbbells | side view |
| Dumbbell curl | `dumbbell-curl.mp4` | Dumbbells | side view |
| Band pull-apart | `band-pull-apart.mp4` | Resistance bands | side view |
| Band seated row | `band-seated-row.mp4` | Resistance bands | side view |
| Band chest press | `band-chest-press.mp4` | Resistance bands | side view |
| Kettlebell deadlift | `kettlebell-deadlift.mp4` | Kettlebell | side view |
| Kettlebell swing | `kettlebell-swing.mp4` | Kettlebell | side view |
| Barbell back squat | `barbell-back-squat.mp4` | Squat rack | side view |
| Barbell deadlift | `barbell-deadlift.mp4` | Barbell | side view |
| Bench press | `bench-press.mp4` | Weight bench | side view |
| Pull-up / assisted pull-up | `pull-up-assisted-pull-up.mp4` | Pull-up bar | side view |
| Cable row | `cable-row.mp4` | Cable machine | side view |
| Leg press | `leg-press.mp4` | Leg press | side view |
| Treadmill incline walk | `treadmill-incline-walk.mp4` | Treadmill | three-quarter front view |
| Bike intervals | `bike-intervals.mp4` | Exercise bike | side view |
| Rowing intervals | `rowing-intervals.mp4` | Rowing machine | side view |
| Elliptical steady state | `elliptical-steady-state.mp4` | Elliptical | three-quarter front view |
| Stair climber | `stair-climber.mp4` | Stair climber | three-quarter front view |
| Jump rope intervals | `jump-rope-intervals.mp4` | Jump rope | three-quarter front view |
| Battle rope waves | `battle-rope-waves.mp4` | Battle ropes | three-quarter front view |
| Swimming laps | `swimming-laps.mp4` | Swimming pool | side view, underwater-line framing |
| Outdoor bike ride | `outdoor-bike-ride.mp4` | Bicycle | side view |
| Foam roller release | `foam-roller-release.mp4` | Foam roller | side view, camera at floor level |
| Stability ball dead bug | `stability-ball-dead-bug.mp4` | Stability ball | side view, camera at floor level |
| Suspension row | `suspension-row.mp4` | Suspension trainer | side view |
| Medicine ball slam | `medicine-ball-slam.mp4` | Medicine ball | side view |
| Outdoor walk | `outdoor-walk.mp4` | Bodyweight | three-quarter front view |
| Easy run | `easy-run.mp4` | Bodyweight | side view |
| Run intervals | `run-intervals.mp4` | Running shoes | side view |
| Stationary bike steady ride | `stationary-bike-steady-ride.mp4` | Exercise bike | side view |
| Spin bike intervals | `spin-bike-intervals.mp4` | Spin bike | side view |
| Smart trainer ride | `smart-trainer-ride.mp4` | Smart bike trainer | side view |

## Coach photos (optional)
Put square photos in `media/coaches/` (e.g. `guide.jpg`) and set the paths in `config.js` under `COACH_PHOTOS`. Use only images you created or have the right to use.
