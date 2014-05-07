/**
  NUNUX Orbino

  Copyright (c) 2014 Nicolas CARLIER (https://github.com/ncarlier)

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

#define DEBUG 1

#include <SPI.h>
#include <Ethernet.h>
#include <PubSubClient.h>
#include <stdarg.h>
#include <math.h>


#define color_t int32_t
#define COLOR(r,g,b)   (((r)<<16)+((g)<<8)+(b))  //Color is 24-bit (8-bit each R, G, B)
#define COLOR_WHITE    0xffffff
#define COLOR_BLACK    0x0 
#define COLOR_RED      0xff0000
#define COLOR_GREEN    0x00ff00
#define COLOR_BLUE     0x0000ff
#define COLOR_CYAN     0x00ffff
#define COLOR_MAGENTA  0xff00ff
#define COLOR_YELLOW   0xffff00
#define RED(a) (a>>16)
#define GREEN(a) ((a>>8) & 0xff)
#define BLUE(a) (a & 0xff)

// LED leads connected to PWM pins
const int RED_LED_PIN = 3;
const int GREEN_LED_PIN = 5;
const int BLUE_LED_PIN = 6;

// Update these with values suitable for your network.
byte mac[] = { 0x90, 0xA2, 0xDA, 0x0D, 0x04, 0x9C };
IPAddress ip(192,168,0, 6);
IPAddress gateway(192,168,0, 1);
IPAddress subnet(255, 255, 255, 0);

// Broker conf.
byte server[] = { 192, 168, 0, 5 };
//char domain[] = "test.mosquitto.org";
int port = 1883;
char topic[] = "arduino/orb";

#if DEBUG > 0
void debug(char *fmt, ... ){
  char tmp[128]; // resulting string limited to 128 chars
  va_list args;
  va_start (args, fmt );
  vsnprintf(tmp, 128, fmt, args);
  va_end (args);
  Serial.println(tmp);
}
#endif

color_t convertHexToColor(char* hex) {
  return strtol (hex,&hex,16);
}

void setLedColor(color_t c) {
  analogWrite(RED_LED_PIN, RED(c));
  analogWrite(GREEN_LED_PIN, GREEN(c));
  analogWrite(BLUE_LED_PIN, BLUE(c));
}

color_t fadeColor(color_t c1, color_t c2, float ratio){
  color_t r = RED(c1);
  color_t g = GREEN(c1);
  color_t b = BLUE(c1);
  r += (RED(c2)-r)*ratio;
  g += (GREEN(c2)-g)*ratio;
  b += (BLUE(c2)-b)*ratio;
  return COLOR(r, g, b);
}

void setLedColorGradually(color_t c1, color_t c2, int nc, int ms) {
  for (float i = 0 ; i < nc ; i++) {
    setLedColor(fadeColor(c1, c2, i/nc));
    delay(ms);
  }
  setLedColor(c2);
}

void blinkLed(color_t color, int ms, int nb) {
  if (nb < 0) {
    for(;;) {
      setLedColor(color);
      delay(ms);
      setLedColor(COLOR_BLACK);
      delay(ms);
    }
  } else {
    for (int i = 0 ; i < nb ; i++) {
      setLedColor(color);
      delay(ms);
      setLedColor(COLOR_BLACK);
      delay(ms);
    }
  }
}

color_t c_old = COLOR_BLACK;

void callback(char* topic, byte* payload, unsigned int length) {
  // handle message arrived
  #if DEBUG > 0
    Serial.print("Callback:{topic:\"");
    Serial.print(topic);
    Serial.print("\", payload:\""); 
    Serial.write(payload,length); 
    Serial.println("\"}");
  #endif

  color_t c;
  if (!memcmp(payload,"off",length)) c = COLOR_BLACK;
  else if (!memcmp(payload,"on",length)) c = COLOR_WHITE;
  else if (!memcmp(payload,"red",length)) c = COLOR_RED;
  else if (!memcmp(payload,"green",length)) c = COLOR_GREEN;
  else if (!memcmp(payload,"blue",length)) c = COLOR_BLUE;
  else if (!memcmp(payload,"cyan",length)) c = COLOR_CYAN;
  else if (!memcmp(payload,"magenta",length)) c = COLOR_MAGENTA;
  else if (!memcmp(payload,"yellow",length)) c = COLOR_YELLOW;
  else if (length == 6) c = convertHexToColor((char*)payload);
  else {
    #if DEBUG > 0
      debug("Unknown color.");
    #endif
    return;
  }

  setLedColorGradually(c_old, c, 255, 10);
  c_old = c;
}

EthernetClient ethClient;
PubSubClient client(server, port, callback, ethClient);

void setup() {
  #if DEBUG > 0
    Serial.begin(9600);
    debug("Init...");
  #endif
  blinkLed(COLOR_RED, 100, 3);

  #if DEBUG > 0
    debug("Start the Ethernet connection with DHCP...");
  #endif
  if (Ethernet.begin(mac) == 0) {
    #if DEBUG > 0
      debug("Failed to configure Ethernet using DHCP. Try static...");
    #endif
    // Blink ired twice to signal static Ethernet configuration.
    blinkLed(COLOR_RED, 500, 2);
    Ethernet.begin(mac, ip, gateway, subnet);
  }

  #if DEBUG > 0
    debug("Ethernet connection started.");
  #endif
  // Blink blue 3 times to tell taht eth is up.
  blinkLed(COLOR_BLUE, 100, 3);

  #if DEBUG > 0
    debug("Connecting to the server...");
  #endif
  if (client.connect("Orbino")) {
    #if DEBUG > 0 
      debug("Connected.");
    #endif
    // Blink green 3 times to tell that connection is ok.
    blinkLed(COLOR_GREEN, 100, 3);
    client.subscribe(topic); 
  } else {
    #if DEBUG > 0 
      debug("Unable to connect :(");
    #endif
    // Blink red 3 times to tell that connection is not ok.
    blinkLed(COLOR_RED, 500, 5);
  }
}

void loop() {
  client.loop();
  delay(1000);
}

