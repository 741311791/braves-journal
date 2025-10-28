import { NodeSDK } from '@opentelemetry/sdk-node';
import { Resource } from '@opentelemetry/resources';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { InstrumentationBase } from '@opentelemetry/instrumentation';

interface TracingConfig {
  enabled: boolean;
  serviceName: string;
  endpoint: string;
}

class PrismaInstrumentationPlaceholder extends InstrumentationBase {
  constructor() {
    super('prisma-placeholder', '0.1.0');
  }

  init() {
    return [];
  }
}

class QueueInstrumentationPlaceholder extends InstrumentationBase {
  constructor() {
    super('queue-placeholder', '0.1.0');
  }

  init() {
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

  const metricExporter = new OTLPMetricExporter({
    url: `${config.endpoint}/v1/metrics`,
  });

  sdk = new NodeSDK({
    resource,
    traceExporter,
    metricReader: new PeriodicExportingMetricReader({
      exporter: metricExporter,
      exportIntervalMillis: 60000,
    }),
    instrumentations: [
      new HttpInstrumentation({
        ignoreIncomingPaths: ['/health/live', '/health/ready'],
      }),
      new PrismaInstrumentationPlaceholder(),
      new QueueInstrumentationPlaceholder(),
    ],
  });

  sdk
    .start()
    .then(() => {
      console.log(`OpenTelemetry initialized: ${config.serviceName} -> ${config.endpoint}`);
    })
    .catch((error) => {
      console.error('Failed to start OpenTelemetry SDK', error);
    });
}

export async function shutdownTracing(): Promise<void> {
  if (sdk) {
    await sdk.shutdown().catch((error) => {
      console.error('Failed to shutdown OpenTelemetry SDK', error);
    });
  }
}
