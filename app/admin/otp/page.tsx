import NavigationBar from "@/app/common/components/NavigationBar";
import OTP from "./components/OTPBox";
export default function Page() {
  const handleSubmit = (otp: string) => {
    console.log(otp);
  };
  return (
    <div className="flex min-h-screen items-start justify-center gap-2 dark:bg-gray-800">
      <NavigationBar isAdminPage={true} />
      <div className="relative top-20 mx-auto w-full max-w-screen-xl p-4">
        <OTP length={6} />
      </div>
    </div>
  );
}
