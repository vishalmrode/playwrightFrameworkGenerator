import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { setTheme, Theme } from "@/store/slices/uiSlice";
import { RootState } from "@/store";

export const useTheme = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state: RootState) => state.ui.theme);

  const changeTheme = (newTheme: Theme) => {
    dispatch(setTheme(newTheme));
  };

  return {
    theme,
    setTheme: changeTheme,
  };
};
