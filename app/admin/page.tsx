import NavigationBar from "../common/components/NavigationBar";
import AdminScreen from "./components/AdminScreen";
export default function Page() {
  return (
    <div className="flex min-h-screen items-start justify-center gap-2 dark:bg-gray-800">
      <NavigationBar isAdminPage={true} />
      <div className="relative top-20 mx-auto w-full max-w-screen-xl p-4">
        <AdminScreen />
      </div>
    </div>
  );
}
