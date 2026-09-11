import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AppLayout from "../layouts/AppLayout";
import { saveCheckIn } from "../services/checkInService";
import { calculateCheckInScore } from "../services/recoveryEngine";

const DailyCheckIn = () => {
  const navigate = useNavigate();

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Recovery
  const [alcoholFree, setAlcoholFree] = useState(false);
  const [noSmoking, setNoSmoking] = useState(false);
  const [noDrugs, setNoDrugs] = useState(false);

  // Healthy Habits
  const [exercised, setExercised] = useState(false);
  const [drankWater, setDrankWater] = useState(false);
  const [sleptWell, setSleptWell] = useState(false);

  // Wellness
  const [mood, setMood] = useState("");
  const [stress, setStress] = useState(5);
  const [journal, setJournal] = useState("");
  const [challenge, setChallenge] = useState("");
  const [wins, setWins] = useState("");

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!mood) {
      alert(
        "Please select your mood before saving today's check-in."
      );
      return;
    }

    if (saving) {
      return;
    }

    setSaving(true);

    try {
      /*
       * This object is used by the recovery engine
       * to calculate the user's recovery score.
       */
      const checkInForScore = {
        id: Date.now().toString(),
        date: new Date().toISOString(),

        alcoholFree,
        noSmoking,
        noDrugs,

        exercised,
        drankWater,
        sleptWell,

        mood,
        stress,
        journal,
        challenge,
        wins,
      };

      const result =
        calculateCheckInScore(
          checkInForScore
        );

      /*
       * Send the check-in to the Recovery+ backend.
       *
       * The backend creates the ID and date.
       *
       * The backend also automatically:
       * - saves the DailyCheckIn
       * - updates applicable goals
       * - evaluates achievements
       * - records completed goals
       */
      const savedCheckIn =
        await saveCheckIn({
          alcoholFree,
          noSmoking,
          noDrugs,
          exercised,
          drankWater,
          sleptWell,
          mood,
          stress,
          journal,
          challenge,
          wins,
        });

      console.log(
        "Check-in saved to backend:",
        savedCheckIn
      );

      console.log(
        "Recovery score:",
        result
      );

      /*
       * The check-in has been successfully saved.
       *
       * The backend has already processed the
       * associated goal automation before this
       * request completes.
       *
       * We therefore take the user directly to
       * the Goals page so they can see the updated
       * progress.
       */
      alert(
        `✅ Check-in Saved!

Recovery Score: ${result.score}/100

Level: ${result.level}

${result.message}

Your goals have been updated automatically.

Taking you to your Goals...`
      );

      navigate("/goals");
    } catch (error) {
      console.error(
        "Failed to save check-in:",
        error
      );

      const message =
        error instanceof Error
          ? error.message
          : "Unable to save your check-in.";

      alert(
        `❌ Check-in was not saved.\n\n${message}`
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout title="Daily Check-in">
      <div className="container py-4">
        <h2 className="fw-bold">
          Daily Check-in
        </h2>

        <p className="text-muted">
          {today}
        </p>

        <hr />

        {/* Recovery */}
        <h4 className="mt-4">
          Recovery
        </h4>

        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            checked={alcoholFree}
            onChange={(e) =>
              setAlcoholFree(
                e.target.checked
              )
            }
          />

          <label className="form-check-label">
            Stayed alcohol-free
          </label>
        </div>

        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            checked={noSmoking}
            onChange={(e) =>
              setNoSmoking(
                e.target.checked
              )
            }
          />

          <label className="form-check-label">
            No smoking
          </label>
        </div>

        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            checked={noDrugs}
            onChange={(e) =>
              setNoDrugs(
                e.target.checked
              )
            }
          />

          <label className="form-check-label">
            No drugs
          </label>
        </div>

        {/* Healthy Habits */}
        <h4 className="mt-4">
          Healthy Habits
        </h4>

        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            checked={exercised}
            onChange={(e) =>
              setExercised(
                e.target.checked
              )
            }
          />

          <label className="form-check-label">
            Exercised today
          </label>
        </div>

        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            checked={drankWater}
            onChange={(e) =>
              setDrankWater(
                e.target.checked
              )
            }
          />

          <label className="form-check-label">
            Drank enough water
          </label>
        </div>

        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            checked={sleptWell}
            onChange={(e) =>
              setSleptWell(
                e.target.checked
              )
            }
          />

          <label className="form-check-label">
            Slept well
          </label>
        </div>

        {/* Mood */}
        <h4 className="mt-4">
          Mood
        </h4>

        <select
          className="form-select"
          value={mood}
          onChange={(e) =>
            setMood(e.target.value)
          }
        >
          <option value="">
            Select Mood
          </option>

          <option>
            Excellent 😄
          </option>

          <option>
            Good 😊
          </option>

          <option>
            Okay 😐
          </option>

          <option>
            Low 😔
          </option>

          <option>
            Very Low 😢
          </option>
        </select>

        {/* Stress */}
        <h4 className="mt-4">
          Stress Level
        </h4>

        <input
          type="range"
          className="form-range"
          min="1"
          max="10"
          value={stress}
          onChange={(e) =>
            setStress(
              Number(e.target.value)
            )
          }
        />

        <p>{stress}/10</p>

        {/* Journal */}
        <h4 className="mt-4">
          Journal
        </h4>

        <textarea
          className="form-control"
          rows={5}
          placeholder="How was today?"
          value={journal}
          onChange={(e) =>
            setJournal(
              e.target.value
            )
          }
        />

        {/* Challenges */}
        <h4 className="mt-4">
          Challenges
        </h4>

        <textarea
          className="form-control"
          rows={3}
          placeholder="What challenged you today?"
          value={challenge}
          onChange={(e) =>
            setChallenge(
              e.target.value
            )
          }
        />

        {/* Wins */}
        <h4 className="mt-4">
          Today's Wins
        </h4>

        <textarea
          className="form-control"
          rows={3}
          placeholder="What are you proud of today?"
          value={wins}
          onChange={(e) =>
            setWins(
              e.target.value
            )
          }
        />

        {/* Save Button */}
        <div className="text-center my-5">
          <button
            className="btn btn-primary btn-lg"
            onClick={handleSave}
            disabled={saving}
          >
            {saving
              ? "Saving Check-in..."
              : "Save Today's Check-in"}
          </button>
        </div>
      </div>
    </AppLayout>
  );
};

export default DailyCheckIn;