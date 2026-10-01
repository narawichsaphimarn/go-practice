## explanation
FlightRecorder ในแพ็กเกจ runtime/trace เก็บบันทึกการทำงานช่วงสั้นไว้ในหน่วยความจำก่อนเกิดเหตุ ไม่เขียนลงดิสก์ตลอดเวลา

```
fr := trace.NewFlightRecorder(trace.FlightRecorderConfig{
	MinAge:   time.Second,
	MaxBytes: 1 << 20,
})
fr.Start()
```

ต้อง import "runtime/trace" และ "time" MinAge กับ MaxBytes คือขนาดของหน้าต่างที่เก็บไว้ในหน่วยความจำ

## apply
เมื่อโปรแกรมตัดสินใจว่าเหตุนี้ควรบันทึก จึงเรียก WriteTo เพื่อเขียนหน้าต่างล่าสุดออก มันต่างจากการเปิด trace ทั้งกระบวนการที่เขียนลงดิสก์ตลอดเวลา

```
fr.WriteTo(w)
fr.Stop()
```

WriteTo เขียนช่วงที่เก็บไว้ลง w ต้องเรียกตอน recorder ยังทำงานอยู่ ถ้าเรียก Stop ก่อน WriteTo จะคืน error เขียนเสร็จแล้วจึงเรียก Stop

## easy
ก่อนเกิดเหตุ FlightRecorder เก็บข้อมูลไว้ในหน่วยความจำเป็นช่วงสั้น

```
fr := trace.NewFlightRecorder(trace.FlightRecorderConfig{
	MinAge:   time.Second,
	MaxBytes: 1 << 20,
})
fr.Start()
```

## hard
มันไม่เขียน trace ลงดิสก์ตลอดเวลา เขียนออกเมื่อโปรแกรมตัดสินใจบันทึก ด้วย WriteTo

```
fr.WriteTo(w)
fr.Stop()
```
