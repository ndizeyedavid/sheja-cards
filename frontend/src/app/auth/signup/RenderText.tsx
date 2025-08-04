export default function RenderText({ step }: { step: number }) {
  switch (step) {
    case 0:
      return "Welcome! Let's get you started with SHEJA";
    case 1:
      return "Let's start with your personal information";
    case 2:
      return "Set up your account security";
    case 3:
      return "Verify your identity";
    case 4:
      return "Tell us about your school";
    case 5:
      return "Set up your school's branding";
    case 6:
      return "Review your information";
    default:
      return "";
  }
}
