import React from "react";
import {Renderer} from "@k8slens/extensions";
import nunjucks from "nunjucks";
import * as fs from "fs";
import * as yaml from 'js-yaml';

const {
  Component: { MenuItem, Icon },
} = Renderer;

type Pod = Renderer.K8sApi.Pod;

function neighbourFile(str: string, d: string): string {
  const parts = str.split('/');
  parts[parts.length - 1] = d;
  return parts.join('/');
}

export function ExtensionLinksCount() {
  let clusterSpec = Renderer.Catalog.activeCluster.get().spec
  let path = neighbourFile(clusterSpec.kubeconfigPath, 'link_config')

  const fileContents = fs.readFileSync(path, 'utf8');
  const links = yaml.load(fileContents) as Links;

  if (links == undefined) return null;

  return links.links.length
}

export function PodMenuItem(props: Renderer.Component.KubeObjectMenuProps<Pod>) {
  const { object: pod, toolbar } = props;
  if (!pod) return null;

  let podName = pod.getName()

  let clusterSpec = Renderer.Catalog.activeCluster.get().spec
  let contextName = clusterSpec.kubeconfigContext
  let path = neighbourFile(clusterSpec.kubeconfigPath, 'link_config')

  const fileContents = fs.readFileSync(path, 'utf8');
  const links = yaml.load(fileContents) as Links;

  if (links == undefined) return null;

  nunjucks.configure({ autoescape: true });
  let result = new Array()

  for (let i of links.links) {
    let link = (i as any).link
    let context_settings = link.envs.find((e: any) => {
      return e.env.k8s_context === contextName
    }).env;

    context_settings.pod = podName
    context_settings.namespace = pod.metadata.namespace

    const url = nunjucks.renderString(link.common_pattern, context_settings);

    const elem =
      <MenuItem onClick={() => {
        window.open(url, '_blank')
      }}>
        <Icon
          material={link.material_icon}
          interactive={toolbar}
          title={link.name}
        />
        <span className="title">{link.name}</span>
      </MenuItem>

    result.push(elem);
  }

  return result[0];
}
