import { NodeSDK } from '@opentelemetry/sdk-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { PrismaInstrumentation } from '@prisma/instrumentation';
import type { OtelConfig } from '../config/configuration';

export async function initTracing(config: OtelConfig): Promise<NodeSDK | null> {
  if (!config.enabled) {
    return null;
  }

  const resource = new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: config.serviceName,
  });

  const traceExporter = config.endpoint
    ? new OTLPTraceExporter({
        url: config.endpoint,
      })
    : undefined;

  const instrumentations = [
    new HttpInstrumentation({
      ignoreIncomingPaths: ['/health/live', '/health/ready'],
    }),
    new PrismaInstrumentation({
      enabled: true,
    }),
  ];

  const sdk = new NodeSDK({
    resource,
    traceExporter,
    instrumentations,
  });

  await sdk.start();

  process.on('SIGTERM', () => {
    sdk
      .shutdown()
      .then(() => console.log('Tracing terminated'))
      .catch((error) => console.log('Error terminating tracing', error));
  });

  return sdk;
}
