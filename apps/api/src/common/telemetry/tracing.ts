import { NodeSDK } from '@opentelemetry/sdk-node';
import { Resource } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import type { InstrumentationModuleDefinition } from '@opentelemetry/instrumentation';

interface TracingConfig {
  enabled: boolean;
  serviceName: string;
  endpoint: string;
}

class PrismaInstrumentationPlaceholder {
  instrumentationName = 'prisma-placeholder';
  instrumentationVersion = '0.1.0';

  enable() {}
  disable() {}
  setConfig() {}
  getConfig() {
    return {};
  }
  setTracerProvider() {}
  setMeterProvider() {}
  getModuleDefinitions(): InstrumentationModuleDefinition[] {
    return [];
  }
}

class QueueInstrumentationPlaceholder {
  instrumentationName = 'queue-placeholder';
  instrumentationVersion = '0.1.0';

  enable() {}
  disable() {}
  setConfig() {}
  getConfig() {
    return {};
  }
  setTracerProvider() {}
  setMeterProvider() {}
  getModuleDefinitions(): InstrumentationModuleDefinition[] {
    return [];
  }
}

let sdk: NodeSDK | null = null;

export function setupTracing(config: TracingConfig): void {
  if (!config.enabled) {
    console.log('OpenTelemetry tracing is disabled');
    return;
  }

  const resource = new Resource({
    [ATTR_SERVICE_NAME]: config.serviceName,
  });

  const traceExporter = new OTLPTraceExporter({
    url: `${config.endpoint}/v1/traces`,
  });

  sdk = new NodeSDK({
    resource,
    traceExporter,
    instrumentations: [
      new HttpInstrumentation(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new PrismaInstrumentationPlaceholder() as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new QueueInstrumentationPlaceholder() as any,
    ],
  });

  sdk.start();
  console.log(`OpenTelemetry initialized: ${config.serviceName} -> ${config.endpoint}`);
}

export async function shutdownTracing(): Promise<void> {
  if (sdk) {
    await sdk.shutdown().catch((error) => {
      console.error('Failed to shutdown OpenTelemetry SDK', error);
    });
  }
}
