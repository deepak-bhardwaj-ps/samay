import { Capacitor } from "@capacitor/core";
export async function selectionFeedback() {
  if (!Capacitor.isNativePlatform()) return;
  try {
    const { Haptics } = await import("@capacitor/haptics");
    await Haptics.selectionChanged();
  } catch {
    /* Haptics must never block a time interaction. */
  }
}
