export function isSocialProfileDisabled() {
  return process.env.NEXT_PUBLIC_DISABLE_SOCIAL_PROFILE === "true";
}
