# Arduino 進階 PWM 操作

在先前的內容中曾提過 Arduino 原生的 PWM 操作方式較為簡單，無法做更進一步的頻率控制等等，但這可以透過原生 AVR 微控制器的程式撰寫方式來解決這一問題。

## 暫存器

### Timer/Counter Control Register

- Waveform Generation Mode bits (WGM): these control the overall mode of the timer.
(These bits are split between TCCRnA and TCCRnB.)
- Clock Select bits (CS): these control the clock prescaler
- Compare Match Output A Mode bits (COMnA): these enable/disable/invert output A
- Compare Match Output B Mode bits (COMnB): these enable/disable/invert output B

The Output Compare Registers OCRnA and OCRnB set the levels at which outputs A and B will be affected. When the timer value matches the register value, the corresponding output will be modified as specified by the mode.

The bits are slightly different for each timer, so consult the datasheet for details. Timer 1 is a 16-bit timer and has additional modes. Timer 2 has different prescaler values.

#### TCCRnA

#### TCCRnB

#### TCCRnC

#### OCRnA

輸出暫存器 A

#### OCRnB

輸出暫存器 B

##### n = 0

8-bit Timer/Counter

Timer 0 set as Fast PWM

Timer 0 = pin 5, 6

Timer 0 for millis(), delay()

![](./imgs/arduino_pwm/8-Bit_TCB.png)

![](./imgs/arduino_pwm/TCCR0A.png)

![](./imgs/arduino_pwm/TCCR0B.png)

##### n > 0

16-bit Timer/Counter

![](./imgs/arduino_pwm/16-Bit_TCB.png)

![](./imgs/arduino_pwm/TCCR2A.png)

![](./imgs/arduino_pwm/TCCR2B.png)

## 原理

## Timer 與腳位對照表


|Timer output	|Arduino output|	Chip pin|	Pin name|
|---|---|---|---|
|OC0A|	6	|12|	PD6|
|OC0B|	5|	11|	PD5|
|OC1A|  9|  15| PB1|
|OC1B|	10|	16|	PB2|
|OC2A|	11|	17|	PB3|
|OC2B|	3|	5|	PD3|


## 實驗

在開始之前先解釋一下 Arduino 中的一個巨集 `_BV(x)`

他在定義中是：

```c
#define _BV(x) (1 << x)
```

設定的概念：

```c
PORTC |= _BV(0);     // Set bit 0 only.
PORTC &= ~_BV(1);    // Clear bit 1 only.
PORTC ^= _BV(7);     // Toggle bit 7 only.

```

### Fast PWM

```c
pinMode(3, OUTPUT);
pinMode(11, OUTPUT);
TCCR2A |= _BV(COM2A1) | _BV(COM2B1) | _BV(WGM21) | _BV(WGM20);
TCCR2B |= _BV(CS22);
OCR2A = 180;
OCR2B = 50;
```

- Output A frequency: 16 MHz / 64 / 256 = 976.5625Hz
- Output A duty cycle: (180+1) / 256 = 70.7%
- Output B frequency: 16 MHz / 64 / 256 = 976.5625Hz
- Output B duty cycle: (50+1) / 256 = 19.9%

The output frequency is the 16MHz system clock frequency, divided by the prescaler value (64), divided by the 256 cycles it takes for the timer to wrap around. Note that fast PWM holds the output high one cycle longer than the compare register value.

### Phase-Correct PWM

```c
pinMode(3, OUTPUT);
pinMode(11, OUTPUT);
TCCR2A |= _BV(COM2A1) | _BV(COM2B1) | _BV(WGM20);
TCCR2B |= _BV(CS22);
OCR2A = 180;
OCR2B = 50
```

Output A frequency: 16 MHz / 64 / 255 / 2 = 490.196Hz
- Output A duty cycle: 180 / 255 = 70.6%
- Output B frequency: 16 MHz / 64 / 255 / 2 = 490.196Hz
- Output B duty cycle: 50 / 255 = 19.6%

Phase-correct PWM divides the frequency by two compared to fast PWM, because the timer goes both up and down. Somewhat surprisingly, the frequency is divided by 255 instead of 256, and the duty cycle calculations do not add one as for fast PWM. See the explanation below under "Off-by-one".

### 程式碼

```c

void setup()
{
  pinMode(5, OUTPUT);
  TCCR0B = TCCR0B | (1<<0) & ~(0b11<<1);//9XX hz *64
  //TCCR2B = TCCR2B | (1<<0) & ~(0b11<<1);//4XX hz *64
}

void loop()
{
  for(int a=0; a<256; a++)
  {  
    analogWrite(5, a);
    delay(1000);
  }
  for(int a=255; a>=0; a--)
  {  
    analogWrite(5, a);
    delay(1000);
  }
}

```

## 參考

- [Secrets of Arduino PWM](https://www.arduino.cc/en/Tutorial/SecretsOfArduinoPWM)
- [ATmega328p datasheet](http://www.atmel.com/images/Atmel-8271-8-bit-AVR-Microcontroller-ATmega48A-48PA-88A-88PA-168A-168PA-328-328P_datasheet_Complete.pdf)
