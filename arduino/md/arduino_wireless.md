# Arduino x Wireless

在萬物皆上網的年代，無線通訊成為一種極為重要的通訊方式，因為「無線」等同擁有高度自由的擺放位置以及安裝方式。

## Wi-Fi

目前最常見的網路通訊方式，有已制定的規範與組織在做維護。

而目前我所知最簡單也最好用的模組是一個來自中國的 **ESP2866** 這個 **Wi-Fi to UART** 模組，它能夠做簡單的資料交換與通訊，且價格便宜，一片大約 200 台幣以內便可取得。

## ESP2866 Wi-Fi to UART Module

請先下載 ESP2866 的相關文件：[下載](https://drive.google.com/file/d/0B71B2uVk0QrAdHh1MWk5a3dKMVE/view?usp=sharing)

### AP\_TCP\_Server 範例

模組設定成 AP Mode 和 TCP Server,當 PC TCP Client 連線時, Arduino 一直送資料給 PC

#### 基本參數

    //使用 UNO 的請設定,其它的 MARK 這一項
    #define UNO 
    //如果有要腳位控制模組啟用,先參考其它PDF做硬體變更 #define
    #define CE_PIN 8 
    //模組的baudrate是9600
    WIFIBaudRate 9600 
    // 設定模組本身當 AP 的 SSID
    String ssid="BuyIC";
    //設定模組本身當AP的密碼
    String pwd ="12345678"; 
    //設定當TCP SERVER的PORT
    String port="8000"; 
    
#### 基本函式

    //模組重新啟動
    wifi.softreset();   
    //設定為 AP+STA 模式 
    wifi.setmode(STATION_AP);   
    //設定定 AP 的 SSID,密碼,通道,認證 機制
    wifi.setAP(ssid,pwd,1,WPA_WPA2_PSK);
    //啟動多路連接模式
    wifi.multipleconnect(MULTIPLE);     
    //開啟TCP SERVER,設定PORT
    wifi.startserver(port);
    //查看AP IP
    String ip = wifi.ShowIP(AP);

### AP\_TCP\_Server_LED 範例

模組設定成 AP Mode 和 TCP Server,當 PC TCP Client 連線後, PC 送”LED ON”􏰁串,Arduino 板子上 LED 會亮起,
PC 送”LED OFF”􏰁串,Arduino 板子上 LED 會熄滅,

### List\_Access\_Point 範例

模組設定成 STA Mode,Arduino 列出附近的 AP

### TCP\_Client 範例

模組設定成STAMode 和TCPClient,當模組連線到PCTCP
Server 時,Arduino 一直送資料給 PC

### TCP\_Server 範例

模組設定成 STA Mode 和 TCP Server,PC TCP Client 連線後, 可以做 Arduino 跟 PC 互傳資料

## nRF24L01 Wireless Module

nRF24L01 是一個更為便宜的無線通訊模組，頻段使用 2.4GHz，每個模組共有 6 個通道可以使用，使用 SPI 作為與 MCU 通訊的方式。

### nRF24L01

![](http://img.single9.net/2015/01/DSCF5800.jpg)

- 使用2.4GHz全球開放頻寬
- 126個可選擇頻道
- 可設定收發位址及頻率
- 最高 2Mbps 的資料傳輸速率
- 可程式控制的輸出功率(最大0dBm，消耗11.3mA)
- 1.9~3.3V低電壓
- 使用SPI界面控制

## RF24 Library

這是一個用來控制 nRF24L01 的函式庫，簡化許多繁瑣的程式碼，改成物件的方式來操作。

- 官方網站：[http://tmrh20.github.io/RF24/index.html](http://tmrh20.github.io/RF24/index.html)
- 下載位址：[https://github.com/TMRh20/RF24/archive/master.zip](https://github.com/TMRh20/RF24/archive/master.zip)

### 匯入函式庫

Arduino 允許開發者擴充內建的函式庫，你只需要將下載後的內容複製到 `我的文件/libraries/` 下即可。

複製完成後，你可以在 **Files > Examples** 中找到**RF24**的範例程式。

![](./imgs/arduino_wireless/install.png)

### 基本範例程式

這是一個兩個點做 ping 的範例程式，你需要有：

- Arduino UNO x2
- nRF24L01 x2

#### 硬體接線

![](./imgs/arduino_wireless/NRF24L01-Receiver.jpg)

(圖源：[NRF24L01 Radio 2.4GHz Transmitter Receiver On Arduino](http://www.bashmodulo.com/arduino/nrf24l01-radio-frequency-transmitter-receiver-on-arduino/))

#### 程式碼

```c
/*
* Getting Started example sketch for nRF24L01+ radios
* This is a very basic example of how to send data from one node to another
* Updated: Dec 2014 by TMRh20
*/
#include <SPI.h>
#include "RF24.h"
/****************** User Config ***************************/
/***      Set this radio as radio number 0 or 1         ***/
bool radioNumber = 0;
/* Hardware configuration: Set up nRF24L01 radio on SPI bus plus pins 7 & 8 */
//RF24 radio(7,8);
// UNO
RF24 radio(11,12);
/**********************************************************/

// 第一種位址表示，5 個英數內
byte addresses[][6] = {"1Node","2Node"};
// Used to control whether this node is sending or receiving
bool role = 0;
void setup() {
  Serial.begin(57600);
  Serial.println(F("RF24/examples/GettingStarted"));
  Serial.println(F("*** PRESS 'T' to begin transmitting to the other node"));
  
  radio.begin();
  // Set the PA Level low to prevent power supply related issues since this is a
 // getting_started sketch, and the likelihood of close proximity of the devices. RF24_PA_MAX is default.
  radio.setPALevel(RF24_PA_LOW);
  
  // Open a writing and reading pipe on each radio, with opposite addresses
  if(radioNumber){
    radio.openWritingPipe(addresses[1]);
    radio.openReadingPipe(1,addresses[0]);
  }else{
    radio.openWritingPipe(addresses[0]);
    radio.openReadingPipe(1,addresses[1]);
  }
  
  // Start the radio listening for data
  radio.startListening();
}
void loop() {
  
  
/****************** Ping Out Role ***************************/  
if (role == 1)  {
    
    radio.stopListening();                                    // First, stop listening so we can talk.
    
    
    Serial.println(F("Now sending"));
    unsigned long time = micros();                             // Take the time, and send it.  This will block until complete
     if (!radio.write( &time, sizeof(unsigned long) )){
       Serial.println(F("failed"));
     }
        
    radio.startListening();                                    // Now, continue listening
    
    unsigned long started_waiting_at = micros();               // Set up a timeout period, get the current microseconds
    boolean timeout = false;                                   // Set up a variable to indicate if a response was received or not
    
    while ( ! radio.available() ){                             // While nothing is received
      if (micros() - started_waiting_at > 200000 ){            // If waited longer than 200ms, indicate timeout and exit while loop
          timeout = true;
          break;
      }      
    }
        
    if ( timeout ){                                             // Describe the results
        Serial.println(F("Failed, response timed out."));
    }else{
        unsigned long got_time;                                 // Grab the response, compare, and send to debugging spew
        radio.read( &got_time, sizeof(unsigned long) );
        unsigned long time = micros();
        
        // Spew it
        Serial.print(F("Sent "));
        Serial.print(time);
        Serial.print(F(", Got response "));
        Serial.print(got_time);
        Serial.print(F(", Round-trip delay "));
        Serial.print(time-got_time);
        Serial.println(F(" microseconds"));
    }
    // Try again 1s later
    delay(1000);
  }
/****************** Pong Back Role ***************************/
  if ( role == 0 )
  {
    unsigned long got_time;
    
    if( radio.available()){
                                                                    // Variable for the received timestamp
      while (radio.available()) {                                   // While there is data ready
        radio.read( &got_time, sizeof(unsigned long) );             // Get the payload
      }
     
      radio.stopListening();                                        // First, stop listening so we can talk   
      radio.write( &got_time, sizeof(unsigned long) );              // Send the final one back.      
      radio.startListening();                                       // Now, resume listening so we catch the next packets.     
      Serial.print(F("Sent response "));
      Serial.println(got_time);  
   }
 }
/****************** Change Roles via Serial Commands ***************************/
  if ( Serial.available() )
  {
    char c = toupper(Serial.read());
    if ( c == 'T' && role == 0 ){      
      Serial.println(F("*** CHANGING TO TRANSMIT ROLE -- PRESS 'R' TO SWITCH BACK"));
      role = 1;                  // Become the primary transmitter (ping out)
    
   }else
    if ( c == 'R' && role == 1 ){
      Serial.println(F("*** CHANGING TO RECEIVE ROLE -- PRESS 'T' TO SWITCH BACK"));      
       role = 0;                // Become the primary receiver (pong back)
       radio.startListening();
       
    }
  }
} // Loop
```

### 範例 - 資料傳送

```c
/*
TMRh20 2014

 This program is free software; you can redistribute it and/or
 modify it under the terms of the GNU General Public License
 version 2 as published by the Free Software Foundation.
 */

/** General Data Transfer Rate Test
 * This example demonstrates basic data transfer functionality with the 
 updated library. This example will display the transfer rates acheived using
 the slower form of high-speed transfer using blocking-writes.
 */


#include <SPI.h>
#include "RF24.h"
#include "printf.h"

/*************  USER Configuration *****************************/
                                          // Hardware configuration
//RF24 radio(7,8);                        // Set up nRF24L01 radio on SPI bus plus pins 7 & 8
RF24 radio(11,12);

/***************************************************************/

// 第二種位址表示，要改，格式：16進制，範例：0xA0B0C0D0E0LL
const uint64_t pipes[2] = { 0xABCDABCD71LL, 0x544d52687CLL };   // Radio pipe addresses for the 2 nodes to communicate.

byte data[32];                           //Data buffer for testing data transfer speeds

unsigned long counter, rxTimer;          //Counter and timer for keeping track transfer info
unsigned long startTime, stopTime;  
bool TX=1,RX=0,role=0;

void setup(void) {

  Serial.begin(115200);
  printf_begin();

  radio.begin();                           // Setup and configure rf radio
  radio.setChannel(1);
  radio.setPALevel(RF24_PA_MAX);
  radio.setDataRate(RF24_1MBPS);
  radio.setAutoAck(1);                     // Ensure autoACK is enabled
  radio.setRetries(2,15);                  // Optionally, increase the delay between retries & # of retries
  
  radio.setCRCLength(RF24_CRC_8);          // Use 8-bit CRC for performance
  radio.openWritingPipe(pipes[0]);
  radio.openReadingPipe(1,pipes[1]);
  
  radio.startListening();                 // Start listening
  radio.printDetails();                   // Dump the configuration of the rf unit for debugging
  
  printf("\n\rRF24/examples/Transfer Rates/\n\r");
  printf("*** PRESS 'T' to begin transmitting to the other node\n\r");
  
  randomSeed(analogRead(0));              //Seed for random number generation
  
  for(int i=0; i<32; i++){
     data[i] = random(255);               //Load the buffer with random data
  }
  radio.powerUp();                        //Power up the radio
}

void loop(void){


  if(role == TX){
    
    delay(2000);
    
    printf("Initiating Basic Data Transfer\n\r");
    
    
    unsigned long cycles = 10000; //Change this to a higher or lower number. 
    
    startTime = millis();
    unsigned long pauseTime = millis();
            
    for(int i=0; i<cycles; i++){        //Loop through a number of cycles
      data[0] = i;                      //Change the first byte of the payload for identification
      if(!radio.writeFast(&data,32)){   //Write to the FIFO buffers        
        counter++;                      //Keep count of failed payloads
      }
      
      //This is only required when NO ACK ( enableAutoAck(0) ) payloads are used
//      if(millis() - pauseTime > 3){
//        pauseTime = millis();
//        radio.txStandBy();          // Need to drop out of TX mode every 4ms if sending a steady stream of multicast data
//        //delayMicroseconds(130);     // This gives the PLL time to sync back up   
//      }
      
    }
    
   stopTime = millis();   
                                         //This should be called to wait for completion and put the radio in standby mode after transmission, returns 0 if data still in FIFO (timed out), 1 if success
   if(!radio.txStandBy()){ counter+=3; } //Standby, block only until FIFO empty or auto-retry timeout. Flush TX FIFO if failed
   //radio.txStandBy(1000);              //Standby, using extended timeout period of 1 second
   
   float numBytes = cycles*32;
   float rate = numBytes / (stopTime - startTime);
    
   Serial.print("Transfer complete at "); Serial.print(rate); Serial.println(" KB/s");
   Serial.print(counter); Serial.print(" of "); Serial.print(cycles); Serial.println(" Packets Failed to Send");
   counter = 0;   
    
   }
  
  
  
if(role == RX){
     while(radio.available()){       
      radio.read(&data,32);
      counter++;
     }
   if(millis() - rxTimer > 1000){
     rxTimer = millis();     
     unsigned long numBytes = counter*32;
     Serial.print("Rate: ");
     //Prevent dividing into 0, which will cause issues over a period of time
     Serial.println(numBytes > 0 ? numBytes/1000.0:0);
     Serial.print("Payload Count: ");
     Serial.println(counter);
     counter = 0;
   }
  }
  //
  // Change roles
  //

  if ( Serial.available() )
  {
    char c = toupper(Serial.read());
    if ( c == 'T' && role == RX )
    {
      printf("*** CHANGING TO TRANSMIT ROLE -- PRESS 'R' TO SWITCH BACK\n\r");
      radio.openWritingPipe(pipes[1]);
      radio.openReadingPipe(1,pipes[0]);
      radio.stopListening();
      role = TX;                  // Become the primary transmitter (ping out)
    }
    else if ( c == 'R' && role == TX )
    {
      radio.openWritingPipe(pipes[0]);
      radio.openReadingPipe(1,pipes[1]); 
      radio.startListening();
      printf("*** CHANGING TO RECEIVE ROLE -- PRESS 'T' TO SWITCH BACK\n\r");      
      role = RX;                // Become the primary receiver (pong back)
    }
  }
}
```

