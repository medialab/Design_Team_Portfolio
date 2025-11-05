// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { DevicePayload } from 'sveltekit-device-detector/dist/types';


declare global {
	namespace App {
		interface Locals {
			deviceType: DevicePayload;
		}
	
		interface PageData {
			deviceType: DevicePayload;
		}
	
		interface Platform {}
	
		interface PrivateEnv {}
	
		interface PublicEnv {}	
	}
}

export {};
