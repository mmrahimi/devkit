import { stringify } from 'yaml';
import type { ComposeService } from './types';

function nonEmpty(value: string) {
  return value.trim() ? value : undefined;
}

function namedVolumeNames(services: ComposeService[]) {
  return [...new Set(services.flatMap((service) => service.volumes.flatMap((entry) => {
    const mount = entry.trim();
    if (/^[A-Za-z]:[\\/]/.test(mount)) return [];
    const source = mount.split(':', 1)[0]?.trim();
    if (!source || source.startsWith('.') || source.startsWith('/') || source.startsWith('~') || /^[A-Za-z]:[\\/]/.test(source)) return [];
    return [source];
  })))];
}

function loopbackPortMapping(port: string) {
  const parts = port.split(':');
  if (parts.length === 1) return `127.0.0.1:${parts[0]}:${parts[0]}`;
  if (parts.length === 2) return `127.0.0.1:${port}`;
  return `127.0.0.1:${parts.slice(1).join(':')}`;
}

export function generateComposeYaml(services: ComposeService[]) {
  const output: Record<string, unknown> = { services: {} };
  const serviceEntries: Record<string, unknown> = {};

  for (const service of services) {
    const config: Record<string, unknown> = {};
    if (service.source === 'image') {
      if (nonEmpty(service.image)) config.image = service.image;
    }
    else {
      const build: Record<string, unknown> = {
        context: nonEmpty(service.buildContext) ?? '.',
        dockerfile: nonEmpty(service.dockerfile) ?? 'Dockerfile',
      };
      const args = Object.fromEntries(service.buildArgs.filter((arg) => arg.key.trim()).map(({ key, value }) => [key.trim(), value]));
      if (Object.keys(args).length) build.args = args;
      if (nonEmpty(service.buildTarget)) build.target = service.buildTarget;
      config.build = build;
    }

    const ports = service.ports.map((port) => port.trim()).filter(Boolean).map(loopbackPortMapping);
    if (ports.length) config.ports = ports;
    const environment = Object.fromEntries(service.environment.filter((item) => item.key.trim()).map(({ key, value }) => [key.trim(), value]));
    if (Object.keys(environment).length) config.environment = environment;
    const volumes = service.volumes.map((volume) => volume.trim()).filter(Boolean);
    if (volumes.length) config.volumes = volumes;
    if (service.restart !== 'no') config.restart = service.restart;

    const dependencies = Object.fromEntries(service.dependencies.filter((item) => item.service).map((item) => [
      item.service,
      { condition: item.condition },
    ]));
    if (Object.keys(dependencies).length) config.depends_on = dependencies;

    if (nonEmpty(service.command)) config.command = service.command;
    if (nonEmpty(service.entrypoint)) config.entrypoint = service.entrypoint;
    if (service.healthcheckDisabled) {
      config.healthcheck = { disable: true };
    } else if (nonEmpty(service.healthcheckTest)) {
      config.healthcheck = {
        test: ['CMD-SHELL', service.healthcheckTest],
        ...(nonEmpty(service.healthcheckInterval) ? { interval: service.healthcheckInterval } : {}),
        ...(nonEmpty(service.healthcheckStartInterval) ? { start_interval: service.healthcheckStartInterval } : {}),
        ...(nonEmpty(service.healthcheckTimeout) ? { timeout: service.healthcheckTimeout } : {}),
        ...(nonEmpty(service.healthcheckRetries) ? { retries: Number(service.healthcheckRetries) || service.healthcheckRetries } : {}),
        ...(nonEmpty(service.healthcheckStartPeriod) ? { start_period: service.healthcheckStartPeriod } : {}),
      };
    }
    const networks = service.networks.split(',').map((network) => network.trim()).filter(Boolean);
    if (networks.length) config.networks = networks;
    serviceEntries[service.name] = config;
  }

  output.services = serviceEntries;
  const volumes = namedVolumeNames(services);
  if (volumes.length) output.volumes = Object.fromEntries(volumes.map((name) => [name, {}]));
  const networks = [...new Set(services.flatMap((service) => service.networks.split(',').map((name) => name.trim()).filter(Boolean)))];
  if (networks.length) output.networks = Object.fromEntries(networks.map((name) => [name, {}]));
  return stringify(output, { lineWidth: 0 });
}
