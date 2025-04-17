import { Pomodoro } from "@/components/pomodoro";

function App(): React.ReactNode {
  return (
    <div className="min-h-screen w-full flex justify-center items-center duration-250">
      <Pomodoro />
    </div>
  );
}

export default App;
