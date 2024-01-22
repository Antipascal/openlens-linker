import React from "react";
import { Renderer } from "@k8slens/extensions";
import {ExtensionLinksCount, PodMenuItem} from "./src/pod-menu-item";

type Pod = Renderer.K8sApi.Pod;

function constructMenuItems() {
  let count = ExtensionLinksCount()
  let itemList = new Array()

  for (let i = 0; i < count; i++) {
    let item = {
      kind: "Pod",
      apiVersions: ["v1"],
      components: {
        MenuItem: (props: Renderer.Component.KubeObjectMenuProps<Pod>) => (
          <PodMenuItem {...props}/>
        ),
      }
    };

    itemList.push(item)
  }

  return itemList
}

export default class OciImageExtensionRenderer extends Renderer.LensExtension {

  kubeObjectMenuItems = constructMenuItems()
}
