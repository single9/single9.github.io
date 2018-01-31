# 基本概念

## Arduino UNO

Arduino UNO 是 Arduino 系列中最常被拿來做實驗與開發的板子，它具有便宜、輕便、資源多、模組多等特色，因此非常建議作為 Arduino 的新手入門選擇。

![](https://www.arduino.cc/en/uploads/Main/ArdGen_UNO.jpg)

核心晶片為 ATmega328p，擁有：

| 項目 | 規格 |
|:------|:-----|
|Microcontroller|	ATmega328P|
|Operating Voltage|	5V|
|Input Voltage (recommended) |	7-12V|
|Input Voltage (limit)|	6-20V|
|Digital I/O Pins	|14 (of which 6 provide PWM output)|
|PWM Digital I/O Pins |	6|
|Analog Input Pins|	6|
|DC Current per I/O Pin	|20 mA|
|DC Current for 3.3V Pin|	50 mA|
|Flash Memory	|32 KB (ATmega328P)of which 0.5 KB used by bootloader|
|SRAM	|2 KB (ATmega328P)|
|EEPROM	|1 KB (ATmega328P)|
|Clock Speed	|16 MHz|
|Length	|68.6 mm|
|Width	|53.4 mm|
|Weight	|25 g|

## Wiring Framwork

Arduino 所採用的是一個稱作 Wiring 的架構所設計的程式設計流程，他拿掉 `main()` 這個制式的主程式進入點，改由 `setup()` 以及 `loop()` 來取代。

據說這樣可以更容易理解整個程式的運作，並且提高可閱讀性。

## Wiring-Style 的實作

一般來說，傳統的程式語言在撰寫時都會以 `main()` 來作為程式的進入點，並把主要執行的程式碼都置於這。

先來看看一般程式語言撰寫時的樣子：

```c

#include "Arduino.h"

int led = 13;

int main() 
{

    pinMode(led, OUTPUT);

    while(1) 
    {
        digitalWrite(led, HIGH);   // HIGH = 1
        delay(1000);               // 1000 ms
        digitalWrite(led, LOW);    // LOW = 0
        delay(1000);               // 1000 ms
    }
}
	
```
	
實作成 Wiring-style 就會變這樣

```c

#include "Arduino.h"

int led = 13;

void setup() 
{
    pinMode(led, OUTPUT);
}

void loop() 
{
    digitalWrite(led, HIGH);   // HIGH = 1
    delay(1000);               // 1000 ms
    digitalWrite(led, LOW);    // LOW = 0
    delay(1000);               // 1000 ms
}

int main() {

    setup();

    while(1) {
        loop();
    }
}

```
	
而 Arduino 中(或稱 Wiring-style)，他隱藏掉 `main()`，所以在 Arduino 的程式中你只會看到 `setup()` 與 `loop()`。所以 Arduino 的程式碼看起來會像這樣：

```c

int led = 13;

void setup() 
{
  pinMode(led, OUTPUT);
}

void loop() 
{
    digitalWrite(led, HIGH);   // HIGH = 1
    delay(1000);               // 1000 ms
    digitalWrite(led, LOW);    // LOW = 0
    delay(1000);               // 1000 ms
}
    
```


# Hello World

這部分我們開始進入正式的課程內容，首先從硬體版的 Hello World 開始。

## 事前準備

- 麵包板
- LED 若干

## 點亮 LED

嵌入式系統的 Hello World 通常都是用 LED 來做，這有兩個意義，第一是證明程式能夠執行，第二是測試嵌入式系統的晶片是否正常。

### 程式碼

```c

// Arduino 的板子上都有一顆 LED 在第 13 腳上
// 腳位定義:
int led = 13;

// Setup 只會執行一次:
void setup() 
{
  // 將 led 腳位定義為數位輸出
  pinMode(led, OUTPUT);
  // 點亮 LED
  digitalWrite(led, HIGH);   // HIGH = 1
}

// loop() = while(1):
void loop() 
{
    // 不做事
}
    
```
    
如果板子上的 LED 不會亮，有可能是你沒燒錄成功，也有可能是板子損毀，但通常都是程式沒燒好或者是燒錄出問題。

## LED 閃爍

### 程式碼

```c

// Arduino 的板子上都有一顆 LED 在第 13 腳上
// 腳位定義:
int led = 13;

// Setup 只會執行一次:
void setup() 
{
  // 將 led 腳位定義為數位輸出
  pinMode(led, OUTPUT);
}

// loop() = while(1):
void loop() 
{
  digitalWrite(led, HIGH);   // HIGH = 1
  delay(1000);               // 1000 ms
  digitalWrite(led, LOW);    // LOW = 0
  delay(1000);               // 1000 ms
}
    
```

## LED 跑馬燈

### 硬體接線

![](./imgs/arduino_basic/led_4.jpg)

### 程式碼

```c

int BASE = 10; // 從腳位 10 開始
int NUM = 4;   // LED 的總數

void setup()
{
    // 用迴圈設定腳位
   for (int i = BASE; i < BASE + NUM; i ++) 
   {
     pinMode(i, OUTPUT);
   }
}

void loop()
{
   for (int i = BASE; i < BASE + NUM; i ++) 
   {
     digitalWrite(i, LOW);
     delay(200);
   }
   for (int i = BASE; i < BASE + NUM; i ++) 
   {
     digitalWrite(i, HIGH);
     delay(200);
   }  
}
	
```
	
## Hello 作業

### 單顆 LED 跑馬燈

請利用以上的程式碼所提到的方式，達成 LED **單顆跑馬燈**。

### 單顆 LED 來回跑馬燈

請利用以上的程式碼所提到的方式，達成 LED 單顆**來回**跑馬燈。

### 跑馬燈速度

請利用以上的程式碼所提到的方式，讓 LED 跑馬燈(任一種)，執行**速度由快到慢再增快**然後不斷重複。

# Click Click Click

如果一個單晶片的系統只做 LED 顯示，未免也太單調了些。在這一節中，我們將教你如何讓 Arduino UNO  讀取外部按鍵的狀態，然後變更 LED 的閃爍速度。

## 事前準備

- 按鈕 x1
- LED x5

## LED 控制

上一節我們只是讓 LED 在固定的時間內亮起、滅掉，或者是讓一整排的 LED 能夠個別點亮或滅掉，而當你要改變閃爍速度或亮滅順序的時候，你就必須要重新撰寫一次程式碼、編譯然後燒錄到 Arduino 中。

這樣的過程其實一點也不有趣，如果我們能夠靠按下一個或多個按鈕來讓閃爍速度改變或讓 LED 跑馬燈的順序改變，那應該會有去得多對吧？

這一節將告訴你，如何讓 Arduino 能夠讀取按鈕按下的動作，並且讓上述的功能實現！

## 基本語法

與點亮 LED 時相同，我們必須要在程式中定義腳位資訊，讓 Arduino 知道哪個腳位是做什麼，而因為按鈕是屬於輸入，因此在 `setup()` 中我們必須加入這行程式碼：

	pinMode(腳位, INPUT);	// 腳位為 Arduino 腳位

如此一來便能使那個腳位作為輸入來讀取，但這樣還不夠，我們只是使腳位能夠讀取輸入訊號罷了，但在程式中並無法直接讀取，我們必須要用一個變數來接收讀取到的值，如：

	int input = digitalRead(腳位);	// 腳位為 Arduino 腳位
	
如此，當你按下按鈕時，變數 input 便會變成 1(或0，根據電路)，有了這個變數，我們便可以在程式中做更多的流程控制。

## 一鍵開關 LED

是否看過許多用一個按鍵就能開關的電器呢？我們將來實作這一個功能，來幫助你理解這 `digitalRead(腳位)` 的使用方式。

### 硬體接線

![](./imgs/arduino_basic/led_sw.jpg)

### 程式碼

```c

int led = 13;	// LED 腳位
int btn = 2;		// 按鈕腳位
int isPressed = 0;	// 是否被按過的判斷

void setup() 
{
    // 設定 led 為輸出
    pinMode(led, OUTPUT);
    // 設定 btn 為輸入
    pinMode(btn, INPUT);
}

void loop() 
{
    int b = digitalRead(btn);

    if( b ) {
        // 如果按鈕按下時，isPressed 反向
        isPressed = !isPressed;
        // 當按鈕按住時進入無窮迴圈
        while(digitalRead(btn));
    }

    if( isPressed )
        digitalWrite(led, HIGH);   // 點亮
    else
        digitalWrite(led, LOW);   // 滅掉
}
    
```

## LED 變速閃爍

在這個範例程式中，我們將按鈕的輸入腳位設定在 Arduino UNO 的第 2 隻腳，然後使用板子上的 LED 來顯示我們的結果。

當程式燒錄到 Arduino 後，你會看到 LED 以大約每秒一次的頻率閃爍，這時你可以按下按鈕，應會看到 LED 加速閃爍。

### 硬體接線

![](./imgs/arduino_basic/led_sw.jpg)

### 程式碼

```c

int led = 13;	// LED 腳位
int btn = 2;		// 按鈕腳位

void setup() 
{
    // 設定 led 為輸出
    pinMode(led, OUTPUT);
    // 設定 btn 為輸入
    pinMode(btn, INPUT);
}

void loop() 
{
    int b = digitalRead(btn);

    if( b ) {
        // 如果按鈕按下時，閃爍速度為 100 ms
        blink( 100 );
    } else {
        // 如果按鈕放開時，閃爍速度為 1000 ms
        blink( 1000 );
    }
}

// blink( ms )
void blink(int ms)
{
    digitalWrite(led, HIGH);   // 點亮
    delay( ms );
    digitalWrite(led, LOW);    // 點亮
    delay( ms );
}

```

## 改變 LED 跑馬燈方向

還記得上一節的 LED 跑馬燈嗎，現在我們可以靠一個按鈕就讓它改變方向囉！

### 硬體接線

![](./imgs/arduino_basic/led_4_sw.jpg)

### 程式碼

```c

int BASE = 10; // 從腳位 10 開始
int NUM = 4;   // LED 的總數
int btn = 2;   // 按鈕腳位
bool isPressed = false;

void setup()
{
    // 用迴圈設定腳位
   for (int i = BASE; i < BASE + NUM; i ++) 
   {
     pinMode(i, OUTPUT);
   }
   // 設定 btn 為輸入
   pinMode(btn, INPUT);
}

void loop()
{
    int b = digitalRead(btn);
    int i = 0;

    if( b ) 
    {
        isPressed = !isPressed;
        // 當按鈕一值按著時就卡在迴圈中
        while(digitalRead(btn));
    }

    if( isPressed )
    {
        for (int i = BASE; i < BASE + NUM; i++) 
       {
         digitalWrite(i, LOW);
         delay(100);
       }
       for (int i = BASE; i < BASE + NUM; i++) 
       {
         digitalWrite(i, HIGH);
         delay(100);
       }  
    } else {
        for (int i = BASE + NUM - 1; i >= BASE; i--) 
       {
         digitalWrite(i, LOW);
         delay(500);
       }
       for (int i = BASE + NUM - 1; i >= BASE; i--) 
       {
         digitalWrite(i, HIGH);
         delay(500);
       }  
    }
}

```

## Click^3 作業

### 一鍵改變單顆 LED 跑馬燈方向

請利用以上的程式碼所提到的方式，以一個按鍵來改變**單顆LED的跑馬燈**移動的方向。

### 跑馬燈速度

請利用以上的程式碼所提到的方式，讓 LED 跑馬燈(任一種)，譨夠藉由按鈕按壓的次數來做速度控制。

# 串列通訊

Arduio 系列提供至少一組可直接與電腦透過 UART 交換資料的通訊介面，只要 Arduino 有跟電腦透過 USB 連線且安裝驅動程式，便會產生一個 COM Port 以便通訊用。

## 基本語法

啟用串列通訊的方式要先在 `setup()` 中加入

	Serial.begin(9600);
	
這段程式碼，才會啟用預設且與電腦通訊的那組 UART 通訊介面，其中的**9600**是齙率，可用的值如下：

- 300
- 600
- 1200
- 2400
- 4800
- 9600
- 14400
- 19200
- 28800
- 38400
- 57600
- 115200

### 傳送資料

當你要將資料傳速出去時，你必須用如下的指令來傳輸

	// 不自動斷行的 print
	Serial.print("字串內容");
	// 會自動斷行的 print
	Serial.println("字串內容");
	// 傳遞數值
	Serial.print(變數);

要注意的是，Arduino 並沒有提供如 C 語言中的 `printf()` 函式，且也不支援類似 Java 中以 **+** 號連接字串的方式，因此無法只用一個 print 來傳遞所有要傳輸的內容。當你有一串內容要傳輸時，請利用如下的方式來傳：

	Serial.print("Value: ");
	Serial.print( 變數 );
	Serial.print(" Value 2: ");
	Serial.print( 變數2 );
	
### 接收資料

當你需要接收來自電腦(或其他藉由 UART 介面通訊的周邊)時，你就會用到`read()`這個函式。

	char c = Serial.read();

## 與電腦溝通

### 程式碼

```c

char incomingChr = 0;   // 存放讀到的資料

void setup() {
   Serial.begin(9600);     // 以 9600 的齙率啟用 UART 串列傳輸
}

void loop() {

   // 當有資料進來時才傳送資料出去
   if (Serial.available() > 0) {
      // 讀取收到的資料
      incomingChr = Serial.read();

      // 回傳收到的內容
      Serial.print("我收到了： ");
      Serial.println(incomingChr);
   }
}

```

燒錄好程式，然後選擇 Tools -> Serial Monitor 便有一個可與 Arduino 透過 UART 通訊的終端機，當你發送資料時，畫面就會顯示你發送的內容。

## 控制 LED

### 程式碼

```c

int led = 13;			// 板子上的 LED
char incomingChr = 0;   // 存放讀到的資料

void setup() {
   Serial.begin(9600);     // 以 9600 的齙率啟用 UART 串列傳輸
}

void loop() {

   // 當有資料進來時才傳送資料出去
   if (Serial.available() > 0) {
      // 讀取收到的資料
      incomingChr = Serial.read();

      // 當 Arduino 收到字元 L 後，會讓 LED 亮起 0.5 秒
      if( incomingChr == 'L' )
      {
        digitalWrite(led, HIGH);
        delay(500);
      }
   }
}

```

> **小提示：**
> 其實 Arduino UNO 的 Rx 和 Tx 與電腦傳輸的 Rx 和 Tx 是接在一起的

## UART 作業

### 電腦開關 LED

讓 Arduino 收到電腦上的特定按鍵時可以開關 LED，指令與方式任你定。

# PWM 控制

當你想用單晶片控制馬達時，最大的麻煩一定是轉速的控制。一般來說，數位電路只能會送出高態與低態兩種電壓，也就是 Arduino 的正 5V 以及 0V。而這種電壓只能控制馬達轉或不轉，並無法控制轉速。因此我們需要倚靠 PWM 來做控制。

![](https://www.arduino.cc/en/uploads/Tutorial/pwm.gif)

幸運的是，Arduino 的晶片也有提供這個功能。

## 基本語法

Arduino 的 PWM 控制的語法也很簡單，首先要先定義腳位為輸出

	pinMode(腳位, OUTPUT);	// UNO:  3, 5, 6, 9, 10, 11

然後使用這個語法來控制

	// 數值：0 ~ 255
	analogWrite(腳位, 數值);

## 呼吸燈

緩緩亮起又緩緩暗淡的 LED 燈。

### 程式碼

```c

int led = 9;		// LED 腳位
int val = 0;		// 亮度值
int isMax = 0;	// 紀錄亮度是否為最亮

void setup()
{
    pinMode(led, OUTPUT);
}

void loop()
{
    analogWrite(led, val);

    // 如果亮度小於 254 且不是最亮
    if( val < 254 && !isMax )
        i++;
    else
        isMax = 1;

    // 如果亮度大於等於 0 且曾經為最亮		
    if( val >= 0 && isMax )
        i--;
    else
        isMax = 0;
}

```

## PWM 作業

讓 4 顆 LED 呈現拖曳燈的效果。

# 類比輸入

前面幾節講的都是數位的處理，也就是只有 0 和 1 兩種訊號，但我們的世界並不是只有 0 和 1 兩種訊號而已，我們還有更複雜的類比訊號。

諸如電壓、聲音、光亮、溫度等等的，都無法單純的由 0 和 1 構成。

那當我們需要處理這些訊號的時候該怎麼辦呢？

這時候就是 ADC (Analog to Digital Convert, ADC) 出場的時候啦！

### Arduino 中的 ADC

Arduino 所採用的 AVR 微控制器內建有一組可多通道輸入多 ADC，根據型號的不同，其通道數目與效能也有所不同。

以我們常用的 Arduino UNO 為例，其所採用的 ATmega328p 微控制器內建有一組 6 通道 10 位元解析度的 A/D 轉換器，這 6 個通道的輸入腳位分別為 A0 ~ A5。

## 基本語法

在 Arduino 中要讀取 ADC 的輸入很簡單，但一樣要先在 `setup()` 中加入的設定。

	pinMode(腳位, INPUT);	// Arduino UNO: A0~A5

讀值的語法也很簡單，就這樣：

	int val = analogRead(腳位);	// Arduino UNO: A0~A5

## 事前準備

- 可變電阻 x1

## 基本讀取

在這個範例中，我們將直接把可變電阻的電壓值透過 Arduino UNO 讀取後直接回傳到電腦上顯示。

### 硬體接線

### 硬體接線

![](./imgs/arduino_basic/bled_vr.jpg)

### 程式碼

```c

void setup() 
{
    // 設定 RS232
    Serial.begin(9600);
    // 設定 A0 輸入
    pinMode(A0, INPUT);
}

void loop() 
{
    // 讀值
    int val = analogRead(A0);
    // 傳送資料至電腦
    Serial.println( val );
}
    
```

## LED 亮度控制

透過可變電阻來改變 LED 的亮度。

### 硬體接線

![](./imgs/arduino_basic/led_vr.jpg)

### 程式碼

```c

int led = 9;			 // LED 腳位
int analogPin = A0;  // 可變電阻腳位
int val = 0;         // 讀到的數值

void setup()
{
	// 設定 led 為輸出
	pinMode(led, OUTPUT);
	// 設定 A0 輸入
	pinMode(A0, INPUT);
}

void loop()
{
	// 讀值
	val = analogRead(analogPin);
	// 將 0 ~ 1023 的 ADC 值轉成可被接收的 0 ~ 255
	analogWrite(led, val / 4); 
}

```

## LED 跑馬燈速度控制

### 硬體接線

![](./imgs/arduino_basic/led_4_vr.jpg)

### 程式碼

```c

int BASE = 10; // 從腳位 10 開始
int NUM = 4;   // LED 的總數
int analogPin = A0;
int val = 0;	  // 存放 ADC 數值

void setup()
{
    // 用迴圈設定腳位
   for (int i = BASE; i < BASE + NUM; i ++) 
   {
     pinMode(i, OUTPUT);
   }
   // 設定 A0 為輸入
   pinMode(analogPin, INPUT);
}

void loop()
{
   for (int i = BASE; i < BASE + NUM; i ++) 
   {
     digitalWrite(i, LOW);
     val = analogRead(analogPin)
     delay(val);
   }
   for (int i = BASE; i < BASE + NUM; i ++) 
   {
     digitalWrite(i, HIGH);
     val = analogRead(analogPin)
     delay(val);
   }  
}
	
```

# 作業解答
