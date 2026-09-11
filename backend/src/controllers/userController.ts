import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { updateUserPreferences } from "../services/userService";

function isValidTimezone(timezone: string): boolean {
  try {
    Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
    });

    return true;
  } catch {
    return false;
  }
}

export async function updateUserPreferencesController(
  req: AuthRequest,
  res: Response
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const { timezone, locale, language } = req.body;

    if (
      timezone === undefined &&
      locale === undefined &&
      language === undefined
    ) {
      return res.status(400).json({
        message: "Provide at least one preference to update",
      });
    }

    if (
      timezone !== undefined &&
      typeof timezone !== "string"
    ) {
      return res.status(400).json({
        message: "Timezone must be a string",
      });
    }

    if (
      timezone !== undefined &&
      !isValidTimezone(timezone)
    ) {
      return res.status(400).json({
        message: "Invalid timezone",
      });
    }

    if (
      locale !== undefined &&
      typeof locale !== "string"
    ) {
      return res.status(400).json({
        message: "Locale must be a string",
      });
    }

    if (
      language !== undefined &&
      typeof language !== "string"
    ) {
      return res.status(400).json({
        message: "Language must be a string",
      });
    }

    const user = await updateUserPreferences({
      userId: req.user.userId,
      timezone,
      locale,
      language,
    });

    return res.status(200).json({
      message: "User preferences updated successfully",
      user,
    });
  } catch (error) {
    console.error(
      "Update user preferences error:",
      error
    );

    return res.status(500).json({
      message: "Unable to update user preferences",
    });
  }
}