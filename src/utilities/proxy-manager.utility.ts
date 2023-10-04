import { Application } from "express";
import { IProxy } from "@Interfaces/proxy.interface";
import { createProxyMiddleware } from "http-proxy-middleware";
import { PROXY_SOURCE_PREFIX, PROXY_TARGET_PREFIX } from "@Constants/proxy.constants";

export class ProxyManager {
  private proxies: IProxy[] = [];

  public addProxy(proxy: IProxy): void {
    this.proxies.push(proxy);
  }

  public getProxies(): IProxy[] {
    return this.proxies;
  }

  constructor() {
    const keys = Object.keys(process.env);

    keys.forEach(key => {
      if (key.startsWith(PROXY_SOURCE_PREFIX)) {
        const source = process.env[key];
        const target = process.env[key.replace(PROXY_SOURCE_PREFIX, PROXY_TARGET_PREFIX)];

        if (source && target) {
          this.addProxy({ source, target });
        }
      }
    });

    this.proxies.sort((a, b) => b.source.length - a.source.length);
  }

  public start(app: Application): void {
    this.proxies.forEach(proxy => {
      app.use(
        createProxyMiddleware(proxy.source, {
          target: proxy.target,
          changeOrigin: true,
          pathRewrite: { [`^${proxy.source}`]: "" },
        })
      );
    });
  }
}
