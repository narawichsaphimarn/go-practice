## explanation
FlightRecorder in package runtime/trace keeps a short execution trace in memory before an incident. It does not write to disk the whole time.

```
fr := trace.NewFlightRecorder(trace.FlightRecorderConfig{
	MinAge:   time.Second,
	MaxBytes: 1 << 20,
})
fr.Start()
```

Import "runtime/trace" and "time". MinAge and MaxBytes are the size of the window kept in memory.

## apply
When the program decides an event is worth saving, it calls WriteTo to write the latest window out. That is different from tracing the whole process, which writes to disk the entire time.

```
fr.Stop()
fr.WriteTo(w)
```

Stop ends collection. WriteTo writes the kept window to w.

## easy
Before the event, FlightRecorder keeps the data in memory as a short window.

```
fr := trace.NewFlightRecorder(trace.FlightRecorderConfig{
	MinAge:   time.Second,
	MaxBytes: 1 << 20,
})
fr.Start()
```

## hard
It does not write a trace to disk the whole time. It writes out when the program decides to save, through WriteTo.

```
fr.Stop()
fr.WriteTo(w)
```
