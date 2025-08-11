import { useMemo, useState } from "react";

function Calculator() {
  const [annualSalary, setAnnualSalary] = useState<string>("");

  const maxAffordableRent = useMemo(() => {
    const numeric = Number((annualSalary || "").replace(/[^0-9.]/g, ""));
    if (numeric <= 0) return 0;
    return numeric / 30;
  }, [annualSalary]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col justify-start h-full bg-background-grey flex-1">
      <div
        className="flex flex-col justify-center px-4 py-16 w-full flex-1 items-center relative"
        style={{
          backgroundImage:
            "url('https://staticcdn.openrent.co.uk/images/views/search-home/bgImages/Optimised-Medium-2.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="relative z-10 flex flex-col items-center w-full">
          <h1 className="text-white text-2xl font-semibold mb-2 mt-0">
            Affordability Calculator
          </h1>
          <p className="text-white text-sm mb-2 text-center max-w-xl">
            Unsure what rent is affordable for your income? Enter your
            household's annual salary below to get an estimate.
          </p>

          <div className="flex flex-col gap-4 p-6 bg-black/20 max-w-3xl w-full rounded-lg backdrop-blur-xs">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="annual-salary"
                  className="text-white text-sm font-medium"
                >
                  Annual household income
                </label>
                <div className="flex flex-row rounded-sm overflow-hidden">
                  <div className="bg-lighter-grey p-2 rounded-none border border-border font-semibold pointer-events-none text-dark-grey text-center">
                    £
                  </div>
                  <input
                    id="annual-salary"
                    placeholder="e.g. 65000"
                    type="text"
                    className="bg-white p-2 rounded-none w-full border-t border-b border-border outline-none"
                    inputMode="numeric"
                    value={annualSalary}
                    onChange={(e) => setAnnualSalary(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div
                  className={`text-center rounded-md px-4 py-6 max-w-xs backdrop-blur-sm text-white bg-dark-blue`}
                >
                  <div className="text-white text-sm mb-2">
                    We estimate that the monthly rent you could afford on this
                    salary is
                  </div>
                  <div className="text-3xl md:text-4xl font-extrabold text-white">
                    {maxAffordableRent > 0
                      ? "£" + maxAffordableRent.toFixed(0)
                      : "---"}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Calculator;
