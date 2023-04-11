// Arduino Code - RC522 Read RFID Tag UID

#include <SPI.h>
#include <MFRC522.h>

#define ALERT_PIN 4
#define RST_PIN 9
#define SS_PIN 10
 
MFRC522 rfid(SS_PIN, RST_PIN); // Instance of the class

void setup() { 
  Serial.begin(9600);
  SPI.begin(); // Init SPI bus
  rfid.PCD_Init(); // Init RC522 
  delay(5);
}
 
void loop() {
  digitalWrite(ALERT_PIN, LOW); // turn the LED off by making the voltage LOW
  noTone(ALERT_PIN); // turn off buzzer
  // Reset the loop if no new card present on the sensor/reader. This saves the entire process when idle.
  if (!rfid.PICC_IsNewCardPresent())
    return;

  // Verify if the NUID has been readed
  if (!rfid.PICC_ReadCardSerial())
    return;

  digitalWrite(ALERT_PIN, HIGH); // turn the LED on (HIGH is the voltage level)
  tone(ALERT_PIN, 2000); // turn the buzzer on, send sound of 2kHz
  delay(250); // LED and buzzer on for 250ms
  // Serial.print(F("RFID Tag UID:"));
  printHex(rfid.uid.uidByte, rfid.uid.size);

  rfid.PICC_HaltA(); // Halt PICC
}

// Function to dump a byte array as hex values to Serial. 
void printHex(byte *buffer, byte bufferSize) {
  for (byte i = 0; i < bufferSize; i++) {
    Serial.print(buffer[i] < 0x10 ? " 0" : " ");
    Serial.print(buffer[i], HEX);
  }
  Serial.println();
}