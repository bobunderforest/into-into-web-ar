export class DepsContext<Deps extends Record<string, any>> {
  private dependencies: Partial<{ [K in keyof Deps]: Deps[K] }> = {}

  public register<K extends keyof Deps>(name: K, dependency: Deps[K]): void {
    this.dependencies[name] = dependency
  }

  public get<K extends keyof Deps>(name: K): Deps[K] {
    const dependency = this.dependencies[name]
    if (!dependency) {
      throw new Error(`No dependency found with name: ${String(name)}`)
    }
    return dependency
  }
}
