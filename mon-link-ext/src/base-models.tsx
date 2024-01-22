interface Env {
  k8s_context: string
  pod: string
  namespace: string
}

interface Link {
  name: string
  material_icon: string
  common_pattern: string
  envs: Env[]
}

interface Links {
  links: Link[]
}