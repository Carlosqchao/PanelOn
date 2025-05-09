import { stripe } from '../config/stripe';
import { AppService } from '../../../src/app/app.service';
import { firstValueFrom } from 'rxjs';

const priceMap: Record<string, string> = {
  monthly: 'price_1R5cnREFPVbuZe1FMoJvWbph',
  annual: 'price_1R5dfnEFPVbuZe1FRTELKnSH'
};


