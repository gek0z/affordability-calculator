import { useEffect, useMemo, useRef, useState } from "react";

// Using just a few cities for the MVP
type CityKey =
  | "London"
  | "Manchester"
  | "Birmingham"
  | "Leeds"
  | "Bristol"
  | "Glasgow";

// Estimated prices
const CITY_BILLS_GBP_PER_MONTH: Record<CityKey, number> = {
  London: 300,
  Manchester: 250,
  Birmingham: 220,
  Leeds: 190,
  Bristol: 220,
  Glasgow: 180,
};

const currency = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

function slugifyCity(city: string): string {
  return city.trim().toLowerCase().replace(/\s+/g, "-");
}

function useCountUp(targetValue: number, durationMs: number): number {
  const [animatedValue, setAnimatedValue] = useState<number>(0);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    if (!isFinite(targetValue) || targetValue <= 0) {
      setAnimatedValue(0);
      return;
    }

    if (durationMs <= 0) {
      setAnimatedValue(Math.round(targetValue));
      return;
    }

    const startTimestamp = performance.now();
    const startValue = animatedValue;
    const delta = Math.round(targetValue) - startValue;

    if (delta === 0) {
      setAnimatedValue(startValue);
      return;
    }

    const step = (now: number) => {
      const elapsedMs = now - startTimestamp;
      const progress = Math.max(0, Math.min(1, elapsedMs / durationMs));
      const nextValue = Math.round(startValue + delta * progress);
      setAnimatedValue(nextValue);
      if (progress < 1) {
        rafIdRef.current = requestAnimationFrame(step);
      } else {
        rafIdRef.current = null;
      }
    };

    rafIdRef.current = requestAnimationFrame(step);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [targetValue, durationMs]);

  return animatedValue;
}

function Calculator() {
  const [annualSalary, setAnnualSalary] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<CityKey | "">("");

  const maxAffordableRent = useMemo(() => {
    const numeric = Number((annualSalary || "").replace(/[^0-9.]/g, ""));
    if (numeric <= 0) return 0;
    return numeric / 30;
  }, [annualSalary]);

  const animatedRent = useCountUp(
    Math.max(0, Math.round(maxAffordableRent)),
    1000
  );

  const billsEstimate = useMemo(() => {
    if (!selectedCity) return 0;
    return CITY_BILLS_GBP_PER_MONTH[selectedCity as CityKey] ?? 0;
  }, [selectedCity]);

  const openSearch = () => {
    if (!selectedCity || maxAffordableRent <= 0) return;
    const citySlug = slugifyCity(selectedCity);
    const maxPrice = Math.round(maxAffordableRent);
    const url = `https://www.openrent.co.uk/properties-to-rent/${citySlug}?term=${encodeURIComponent(
      selectedCity
    )}&prices_max=${maxPrice}`;
    window.open(url, "_blank");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <main className="flex flex-col justify-start h-full flex-1">
      <div className="flex flex-col justify-center px-4 py-16 w-full flex-1 items-center relative">
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0 backdrop-blur-[2px]"></div>
        <div className="relative z-10 flex flex-col items-center w-full">
          <h1 className="text-white text-3xl font-semibold mb-2 mt-0">
            Affordability Calculator
          </h1>
          <p className="text-white text-sm mb-6 text-center max-w-xl">
            Unsure what rent is affordable for your income? Enter your
            household's annual salary below to get an estimate.
          </p>

          <div className="flex flex-col gap-4 p-6 bg-black/30 max-w-3xl w-full rounded-lg backdrop-blur-xs">
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

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="city"
                  className="text-white text-sm font-medium"
                >
                  Where are you looking to rent?
                </label>
                <select
                  id="city"
                  className="bg-white p-2 rounded-sm border border-border outline-none"
                  value={selectedCity}
                  onChange={(e) =>
                    setSelectedCity((e.target.value || "") as CityKey | "")
                  }
                >
                  <option value="" disabled>
                    Select a city
                  </option>
                  {Object.keys(CITY_BILLS_GBP_PER_MONTH).map((cityKey) => (
                    <option key={cityKey} value={cityKey}>
                      {cityKey}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-center relative">
                <div
                  className={`text-center rounded-md px-4 py-6 w-full backdrop-blur-sm text-white border transition-colors duration-300 ${
                    maxAffordableRent > 0
                      ? "bg-dark-blue/50 border-dark-blue"
                      : "bg-lighter-grey/10 border-dark-grey"
                  }`}
                >
                  <div
                    className={`text-white text-sm mb-2 ${
                      maxAffordableRent > 0 ? "" : "opacity-0"
                    }`}
                  >
                    We estimate that the monthly rent you could afford on this
                    salary is
                  </div>
                  <div
                    className={`text-3xl md:text-4xl font-extrabold text-white mb-2 ${
                      maxAffordableRent > 0 ? "" : "opacity-0"
                    }`}
                  >
                    {maxAffordableRent > 0
                      ? currency.format(animatedRent)
                      : "0"}
                  </div>

                  <p
                    className={`text-xs text-white/80 ${
                      selectedCity && maxAffordableRent > 0 ? "" : "opacity-0"
                    }`}
                  >
                    Plus monthly bills for a 2-bed{" "}
                    <span className="font-bold">
                      {currency.format(billsEstimate)}~
                    </span>
                  </p>

                  {!maxAffordableRent && (
                    <p className="text-xs text-white/80 inset-0 absolute text-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-full italic">
                      Enter your annual salary to start
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={openSearch}
                  disabled={!selectedCity || maxAffordableRent <= 0}
                  className="w-full bg-blue disabled:cursor-not-allowed disabled:opacity-30 text-white px-4 py-2 rounded-sm border border-blue hover:bg-blue/80 transition-colors duration-300 hover:border-dark-blue cursor-pointer font-bold"
                >
                  {selectedCity && maxAffordableRent > 0
                    ? "Search now"
                    : !selectedCity && maxAffordableRent > 0
                    ? "Select a city to search available properties"
                    : "Select a city and income to search available properties"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Calculator;
