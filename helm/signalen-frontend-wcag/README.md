# Signalen frontend Helm chart

This Helm chart contains the Signalen web frontend.

## Configuration

| Parameter | Description | Default |
| --------- | ----------- | ------- |
| `image.repository` | The repository of the Docker image | `signalen/frontend` |
| `image.tag` | The tag of the Docker image | `latest` |
| `replicaCount` | The number of API replicas | `1` |
| `config` | The configuration of the frontend. For all options see [environment.conf.json](https://github.com/Signalen/frontend/blob/develop/environment.conf.json) | `{}` |
| `ingress.enabled` | Expose the API through an ingress | `true` |
| `ingress.annotations` | Additional annotations on the API ingress | `{}` |
| `ingress.hosts` | The hosts of the ingress | `{}` |
| `ingress.tls` | The TLS settings of the ingress | `{}` |
| `extraVolumes` | Ability to add exta volumes | `[]` |
| `extraVolumeMounts` | Ability to add exta volume mounts | `[]` |
| `initContainers` | Ability to add initContainers | `[]` |
| `command` | Override default startup command of the main container | |
| `arguments` | Override default startup arguments of the main container | |

Check [values.yaml](./values.yaml) for all the possible configuration options.
