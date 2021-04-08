import "./App.css";
import { useRecognizer } from "./useRecognizer";
import { useEffect, useState } from "react";
import { GrNext, GrPrevious } from "react-icons/gr";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

function App() {
  const [step, setStep] = useState(0);
  const [problemState, setProblem] = useState(0);
  const [version, setVersion] = useState(0);
  const [key, setKey] = useState(0);
  // const [timer, setTimer] = useState(false);

  const [
    outputText,
    interim,
    startRecognizer,
    endRecognizer,
    error,
    state,
  ] = useRecognizer();

  const arr = [
    {
      problem: "Pthreads refers to ____.",
      options: [
        { key: "1", value: "1) the Windows standard." },
        { key: "2", value: "2) an implementation for thread behavior." },
        { key: "3", value: "3) a specification for thread behavior." },
        {
          key: "4",
          value: "4) an API for process creation and synchronization.",
        },
      ],
      answer: "3",
    },
    {
      problem: "Cancellation points are associated with ____ cancellation.",
      options: [
        { key: "1", value: "1) asynchronous" },
        { key: "2", value: "2) deferred" },
        { key: "3", value: "3) synchronous" },
        { key: "4", value: "4) non-deferred" },
      ],
      answer: "2",
    },
    {
      problem: "A ____ provides an API for creating and managing threads.",
      options: [
        { key: "1", value: "1) set of system calls" },
        { key: "2", value: "2) multicore system" },
        { key: "3", value: "3) thread library" },
        { key: "4", value: "4) multithreading model" },
      ],
      answer: "3",
    },
  ];

  useEffect(() => {
    if (!outputText || outputText === "") {
      return;
    }
    if (outputText.includes("1번")) {
      onCardClick("1");
    } else if (outputText.includes("2번")) {
      onCardClick("2");
    } else if (outputText.includes("3번")) {
      onCardClick("3");
    } else if (outputText.includes("4번")) {
      onCardClick("4");
    }
  }, [outputText]);

  const start = (version) => {
    startRecognizer();
    setVersion(version);
    setStep(0);
  };

  const onCardClick = (key) => {
    const el = arr[step];
    if (!el) {
      return;
    }
    if (el.answer === key) {
      const nextEl = arr[step + 1];
      if (nextEl) {
        setStep((step) => step + 1);
        setKey(key + 1);
      } else {
        endRecognizer();
      }
    } else {
      alert("Try Again");
    }
  };

  const onArrowClick = (opt) => {
    if (opt === 1) {
      const nextEl = arr[step + 1];
      if (nextEl) {
        setStep((step) => step + 1);
      } else {
        endRecognizer();
      }
    } else {
      const prevEl = arr[step - 1];
      if (prevEl) {
        setStep((step) => step - 1);
      } else {
        endRecognizer();
      }
    }
    setKey(key + 1);
    setProblem(0);
  };

  const onClickProblem = () => {
    if (!version) {
      const temp = problemState ? 0 : 1;
      setProblem(temp);
    }
  };

  const renderCard = () => {
    const el = arr[step];
    if (!el) {
      return <></>;
    }

    return (
      <div className="flex aic fdc">
        <div className="problem">
          <GrPrevious
            className="cursor_pointer"
            size="30"
            onClick={(e) => onArrowClick(0)}
          />
          <div className="fl" onClick={(e) => onClickProblem()}>
            {problemState
              ? el.options[Number(el.answer) - 1].value
              : el.problem}
          </div>
          <GrNext
            className="cursor_pointer"
            size="30"
            onClick={(e) => onArrowClick(1)}
          />
        </div>
        <br />
        <div className="flex fdr">
          {el.options.map((option, index) => (
            <div
              className="card aic jcc flex"
              key={index}
              onClick={(e) => {
                onCardClick(option.key);
              }}
            >
              {option.value}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTime = ({ remainingTime }) => {
    if (remainingTime === 0) {
      return <div className="timer">Too late...</div>;
    }

    return (
      <div className="timer">
        <div className="text">Remaining</div>
        <div className="value">{remainingTime}</div>
        <div className="text">seconds</div>
      </div>
    );
  };

  return (
    <div className="flex vw100 vh100 fdc aic p16">
      {(state === "idle" || state === "ended") && (
        <div className="button">
          <h2>Operating System Chapter 4</h2>
          <h3>Threads & Concurrency</h3>
          <div onClick={(e) => start(1)} className="btn btn-success">
            Start(Limit Time)
          </div>
          <div onClick={(e) => start(0)} className="btn btn-success">
            Start(No Limit Time)
          </div>
        </div>
      )}
      {state === "started" && (
        <div className="wrap">
          {version ? (
            <div className="timer-wrapper">
              <CountdownCircleTimer
                key={key}
                isPlaying
                duration={10}
                colors={[["#29b80d", 0.33], ["#F7B801", 0.33], ["#ff0505"]]}
              >
                {renderTime}
              </CountdownCircleTimer>
            </div>
          ) : (
            <></>
          )}
          <div className="pt16">{renderCard()}</div>
        </div>
      )}

      {error && <span className="color_red">!{error}!</span>}
    </div>
  );
}

export default App;
