import { useRouter } from "next/router";
import { useEffect } from "react";
import useStorage from "./useStorage";

export default function useLastPage() {
  const router = useRouter();
  const { getItem, setItem, removeItem } = useStorage();

  const storageType = "session";

  const keys = {
      PreviousPath: key("prevPath"),
      CurrentPath: key("currPath")
  };

  function key(name) {
      return `useLastPage.${name}`
  }

  useEffect(() => {
    // Set the previous path as the value of the current path.
    const prevPath = getItem(keys.CurrentPath, storageType);
    const currPath = router.asPath;
    if (prevPath === currPath) return;

    if (prevPath)
        setItem(keys.PreviousPath, prevPath, storageType);

    // Set the current path value by looking at the browser's location object.
    setItem(keys.CurrentPath, router.asPath);
  }, [ router.asPath ]);

  return {
      previousPath: getItem(keys.PreviousPath)
  };
}