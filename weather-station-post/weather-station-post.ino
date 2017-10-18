#include <SPI.h>
#include <Dhcp.h>
#include <EthernetUdp.h>
#include <EthernetServer.h>
#include <Dns.h>
#include <EthernetClient.h>
#include <Ethernet.h>


String ID = "1";

byte mac[] = {0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED};
IPAddress ip(10,61,2,47);

EthernetClient client;

unsigned long lastConnectionTime = 0;
const unsigned long postingInterval = 10L * 1000L;

void setup() {
  
  Serial.begin(9600);
  while(!Serial) {
    ; // wait for serial port to connect. Needed for native USB port only
  }

  // disable SD SPI
  pinMode(4,OUTPUT);
  digitalWrite(4,HIGH);

  Serial.print(F("Starting ethernet..."));
  if(!Ethernet.begin(mac))
    Serial.println(F("Failed"));
  else Serial.println(Ethernet.localIP());
  Serial.println(F("Ready"));
  delay(1000);
}

void loop() {
  float temperature = -100000, relative_humidity=-100000, atmospheric_pressure=-100000, wind_speed=-100000, wind_direction=-100000, precipitation = -100000;
  
  temperature = random(10,30);
  relative_humidity = random(0,100);
  
  sendData(temperature,relative_humidity,atmospheric_pressure, wind_speed, wind_direction,precipitation);
  
  if (client.available()) {
    char c = client.read();
    Serial.write(c);
  }  
  delay(postingInterval);
}

void sendData(float temperature, float relative_humidity, float atmospheric_pressure, float wind_speed, float wind_direction, float precipitation){
  String PostData = "{";
  PostData += "\"id\":" + ID;
  if(temperature != -100000){
     PostData += ",\"temperature\":";
     PostData.concat(temperature);
  }if(relative_humidity != -100000){
     PostData += ",\"relative_humidity\":";
     PostData.concat(relative_humidity);
  }if(atmospheric_pressure != -100000){
     PostData += ",\"atmospheric_pressure\":";
     PostData.concat(atmospheric_pressure);
  }if(wind_speed != -100000){
     PostData += ",\"wind_speed\":";
     PostData.concat(wind_speed);
  }if(wind_direction != -100000){
     PostData += ",\"wind_direction\":";
     PostData.concat(wind_direction);
  }if(precipitation != -100000){
     PostData += ",\"precipitation\":";
     PostData.concat(precipitation);
  }
  PostData += "}";
  if(!PostData.equals("{}")){
    client.stop();
    Serial.print(PostData + "... ");
    if(client.connect(ip, 2323)) {
      client.println("POST /weathermonitor/data HTTP/1.1");
      client.println("Host: 10.61.2.47");
      client.println("User-Agent: Arduino/1.0");
      client.println("Connection: close");
      client.println("Content-Type: application/json");
      client.print("Content-Length: ");
      client.println(PostData.length());
      client.println();
      client.println(PostData);
      
      Serial.println("Sucesso ao enviar");
    } else {
      Serial.println("Falha ao enviar");
    }
  } else {
    Serial.println("Sem conteúdo para enviar");
  }
}

