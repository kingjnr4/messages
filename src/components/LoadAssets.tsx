import { ReactElement, useEffect, useState } from "react";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import { Text } from "react-native";

export type FontSource = Parameters<typeof Font.loadAsync>[0];
const usePromiseAll = (promises: Promise<void | void[]>[], cb: () => void) =>
  useEffect(() => {
    (async () => {
      await Promise.all(promises);
      cb();
    })();
  });

const useLoadAssets = (assets: number[], fonts: FontSource): boolean => {
  const [ready, setReady] = useState(false);
  usePromiseAll(
    [
      Font.loadAsync(fonts),
      ...assets.map(
        asset => Asset.loadAsync(asset) as unknown as Promise<void>,
      ),
    ],
    () => setReady(true),
  );
  return ready;
};

interface LoadAssetsProps {
  fonts?: FontSource;
  assets?: number[];
  children: ReactElement | ReactElement[];
}

export default function ({
  assets,
  fonts,
  children,
}: LoadAssetsProps): JSX.Element {
  const ready = useLoadAssets(assets || [], fonts || {});
  if (!ready) {
    return <Text>Loading...</Text>;
  }
  return <>{children}</>;
}
