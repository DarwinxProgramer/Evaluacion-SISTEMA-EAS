import fs from 'fs-extra';
import path from 'path';

const HA_DIR = '/app_root/homeassistant';
const CONFIG_FILE = path.join(HA_DIR, 'configuration.yaml');
const AUTOMATIONS_FILE = path.join(HA_DIR, 'automations.yaml');

export async function configureHomeAssistant() {
    console.log(`Checking Home Assistant configuration in ${HA_DIR}...`);

    // Ensure directory exists (might not exist if HA hasn't initialized yet, but we will try)
    await fs.ensureDir(HA_DIR);

    const mqttConfig = `
mqtt:
  broker: eas_broker
  port: 1883
  client_id: homeassistant_eas
  keepalive: 60
`;

    try {
        if (await fs.pathExists(CONFIG_FILE)) {
            const content = await fs.readFile(CONFIG_FILE, 'utf8');
            if (!content.includes('mqtt:')) {
                await fs.appendFile(CONFIG_FILE, mqttConfig);
                console.log('Added MQTT configuration to configuration.yaml');
            } else {
                console.log('MQTT configuration already exists in configuration.yaml');
            }
        }
    } catch (e) {
        console.warn(`Could not setup MQTT config: ${e}`);
    }

    const automationConfig = `
- id: 'eas_alert_logger'
  alias: 'EAS Alert Logger'
  trigger:
    - platform: mqtt
      topic: 'eas/alerts/#'
  action:
    - service: logbook.log
      data:
        name: 'EAS Alert Received'
        message: 'Topic: {{ trigger.topic }} Payload: {{ trigger.payload }}'
`;

    try {
        if (await fs.pathExists(AUTOMATIONS_FILE)) {
            const content = await fs.readFile(AUTOMATIONS_FILE, 'utf8');
            if (!content.includes('eas_alert_logger')) {
                await fs.appendFile(AUTOMATIONS_FILE, automationConfig);
                console.log('Added EAS Alert Logger automation to automations.yaml');
            } else {
                console.log('Automation already exists in automations.yaml');
            }
        }
    } catch (e) {
        console.warn(`Could not setup Automations config: ${e}`);
    }
}
