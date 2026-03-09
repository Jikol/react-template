import { TinyColor } from "@ctrl/tinycolor";
import moment from "moment";
import type { Logger } from "pino";
import pino from "pino";
import type { CSSProperties } from "react";

type TLevels = "debug" | "log" | "success" | "assert" | "warn" | "error";
type TMsgArray = Array<string | boolean | object | number | undefined>;
type TMsgObject = {
  level: TLevels;
  label: string;
  msg: TMsgArray;
  time: number;
  scopeLabel?: string;
  scopeColor?: TRgbColorString;
};
type TParsedMsgObject = {
  msg: TMsgArray;
  level: TLevels;
  label: string;
  scopeLabel?: string;
  scopeColor?: TRgbColorString;
};

const getStyle = (
  props: {
    textColor: TRgbColorString;
    borderColor: TRgbColorString;
    backgroundColor: TRgbColorString;
    margin: string;
    padding: string;
  },
  isLabel = false
): string => {
  return `
    color: ${props.textColor};
    font-size: ${isLabel ? "1em" : "0.95em"};
    font-family: "JetBrains Mono", serif;
    font-weight: ${isLabel ? "bold" : "normal"};
    background: ${props.backgroundColor};
    border: 1px solid ${props.borderColor};
    border-radius: 5px;
    margin: ${props.margin};
    padding: ${props.padding};
  `;
};

const logger = pino<TLevels, true>({
  level: CONFIG._WEBAPP_DEBUG ? "debug" : "log",
  customLevels: {
    debug: 10,
    log: 20,
    success: 20,
    assert: 30,
    warn: 40,
    error: 50
  },
  enabled: CONFIG._WEBAPP_DEBUG,
  useOnlyCustomLevels: true,
  browser: {
    formatters: {
      level: (label) => ({ label: label.toUpperCase(), level: label }),
      log: (object) => {
        const msgObject = object as TMsgObject;

        return {
          msg: msgObject.msg,
          level: msgObject.level,
          label: `[${msgObject.level === "success" ? "LOG" : msgObject.label} | ${moment(msgObject.time).format("HH:mm:ss")}]`,
          scopeLabel: msgObject.scopeLabel
            ? msgObject.scopeLabel.toUpperCase()
            : undefined,
          scopeColor: msgObject.scopeColor ? msgObject.scopeColor : "rgb(227, 227, 227)"
        } as TParsedMsgObject;
      }
    },
    write: (object) => {
      const { msg, label, level, scopeLabel, scopeColor } = object as TParsedMsgObject;

      const colors: Record<TLevels, () => TRgbColorString> = {
        debug: () => "rgb(144, 158, 162)",
        log: () => "rgb(242, 248, 245)",
        success: () => "rgb(70, 244, 213)",
        warn: () => "rgb(243, 234, 163)",
        error: () => "rgb(240, 214, 212)",
        assert: () => "rgb(240, 214, 212)"
      };

      const printMsg: Record<
        TLevels,
        (params: { label: string; msg: TMsgArray; scopeLabel?: string }) => void
      > = {
        debug: ({ label, msg, scopeLabel }) => {
          if (scopeLabel) {
            console.debug(
              "%c%s%s",
              getStyle(
                {
                  textColor: scopeColor ? scopeColor : "transparent",
                  backgroundColor: new TinyColor(scopeColor)
                    .shade(85)
                    .toRgbString() as TRgbColorString,
                  borderColor: scopeColor ? scopeColor : "transparent",
                  margin: "0.15rem 0 0.3rem 0",
                  padding: "0.2rem 0.35rem 0.15rem 0.35rem"
                },
                true
              ),
              scopeLabel,
              "%c%s",
              getStyle({
                textColor: colors[level](),
                backgroundColor: "transparent",
                borderColor: "transparent",
                margin: "0 0 0 0.35rem",
                padding: "0"
              }),
              label,
              "\n",
              ...msg
            );

            return;
          }
          console.debug(
            "%c%s",
            getStyle({
              textColor: colors[level](),
              borderColor: "transparent",
              backgroundColor: "transparent",
              margin: "0 0 0 0.1rem",
              padding: "0.15rem 0 0.25rem 0"
            }),
            label,
            "\n",
            ...msg
          );
        },
        log: ({ label, msg, scopeLabel }) => {
          if (scopeLabel) {
            console.info(
              "%c%s%s",
              getStyle(
                {
                  textColor: scopeColor ? scopeColor : "transparent",
                  backgroundColor: new TinyColor(scopeColor)
                    .shade(85)
                    .toRgbString() as TRgbColorString,
                  borderColor: scopeColor ? scopeColor : "transparent",
                  margin: "0.15rem 0 0.3rem 0",
                  padding: "0.2rem 0.35rem 0.15rem 0.35rem"
                },
                true
              ),
              scopeLabel,
              "%c%s",
              getStyle({
                textColor: colors[level](),
                backgroundColor: "transparent",
                borderColor: "transparent",
                margin: "0 0 0 0.35rem",
                padding: "0"
              }),
              label,
              "\n",
              ...msg
            );

            return;
          }
          console.info(
            "%c%s",
            getStyle({
              textColor: colors[level](),
              borderColor: "transparent",
              backgroundColor: "transparent",
              margin: "0 0 0 0.1rem",
              padding: "0.15rem 0 0.25rem 0"
            }),
            label,
            "\n",
            ...msg
          );
        },
        success: ({ label, msg, scopeLabel }) => {
          if (scopeLabel) {
            console.info(
              "%c%s%s",
              getStyle(
                {
                  textColor: scopeColor ? scopeColor : "transparent",
                  backgroundColor: new TinyColor(scopeColor)
                    .shade(85)
                    .toRgbString() as TRgbColorString,
                  borderColor: scopeColor ? scopeColor : "transparent",
                  margin: "0.15rem 0 0.3rem 0",
                  padding: "0.2rem 0.35rem 0.15rem 0.35rem"
                },
                true
              ),
              scopeLabel,
              "%c%s%s",
              getStyle({
                textColor: colors["log"](),
                backgroundColor: "transparent",
                borderColor: "transparent",
                margin: "0 0 0 0.35rem",
                padding: "0"
              }),
              label,
              "\n%c%s",
              getStyle({
                textColor: colors["success"](),
                borderColor: colors["success"](),
                backgroundColor: new TinyColor(colors["success"]())
                  .shade(85)
                  .toRgbString() as TRgbColorString,
                margin: "0.15rem 0 0.2rem 0rem",
                padding: "0.2rem 0.35rem"
              }),
              msg[0]
            );

            return;
          }
          console.info(
            "%c%s%s",
            getStyle({
              textColor: colors["log"](),
              borderColor: "transparent",
              backgroundColor: "transparent",
              margin: "0 0 0 0.1rem",
              padding: "0.15rem 0 0.25rem 0"
            }),
            label,
            "\n%c%s",
            getStyle({
              textColor: colors["success"](),
              borderColor: colors["success"](),
              backgroundColor: new TinyColor(colors["success"]())
                .shade(85)
                .toRgbString() as TRgbColorString,
              margin: "0.15rem 0 0.2rem 0.3rem",
              padding: "0.2rem 0.35rem"
            }),
            msg[0]
          );
        },
        assert: ({ label, msg, scopeLabel }) => {
          if (msg[0]) return;
          if (scopeLabel) {
            console.error(
              "%c%s%s",
              getStyle(
                {
                  textColor: scopeColor ? scopeColor : "transparent",
                  backgroundColor: new TinyColor(scopeColor)
                    .shade(85)
                    .toRgbString() as TRgbColorString,
                  borderColor: scopeColor ? scopeColor : "transparent",
                  margin: "0.15rem 0 0.25rem 0.25rem",
                  padding: "0.2rem 0.35rem 0.15rem 0.35rem"
                },
                true
              ),
              scopeLabel,
              "%c%s%s",
              getStyle({
                textColor: colors[level](),
                backgroundColor: "transparent",
                borderColor: "transparent",
                margin: "0 0 0 0.35rem",
                padding: "0"
              }),
              label,
              "\n%c%s",
              getStyle({
                textColor: colors[level](),
                borderColor: "transparent",
                backgroundColor: "transparent",
                margin: "0 0 0.25rem -0.05rem",
                padding: "0"
              }),
              msg[1]
            );

            return;
          }
          console.error(
            "%c%s%s",
            getStyle({
              textColor: colors[level](),
              borderColor: "transparent",
              backgroundColor: "transparent",
              margin: "0 0 0 0.15rem",
              padding: "0.15rem 0 0.25rem 0"
            }),
            label,
            "\n%c%s",
            getStyle({
              textColor: colors[level](),
              borderColor: "transparent",
              backgroundColor: "transparent",
              margin: "0 0 0.25rem 0.1rem",
              padding: "0"
            }),
            msg[1]
          );
        },
        warn: ({ label, msg, scopeLabel }) => {
          if (scopeLabel) {
            console.warn(
              "%c%s%s",
              getStyle(
                {
                  textColor: scopeColor ? scopeColor : "transparent",
                  backgroundColor: new TinyColor(scopeColor)
                    .shade(85)
                    .toRgbString() as TRgbColorString,
                  borderColor: scopeColor ? scopeColor : "transparent",
                  margin: "0.15rem 0 0.25rem 0.25rem",
                  padding: "0.2rem 0.35rem 0.15rem 0.35rem"
                },
                true
              ),
              scopeLabel,
              "%c%s",
              getStyle({
                textColor: colors[level](),
                backgroundColor: "transparent",
                borderColor: "transparent",
                margin: "0 0 0 0.35rem",
                padding: "0"
              }),
              label,
              "\n",
              ...msg
            );

            return;
          }
          console.warn(
            "%c%s",
            getStyle({
              textColor: colors[level](),
              borderColor: "transparent",
              backgroundColor: "transparent",
              margin: "0 0 0 0.15rem",
              padding: "0.15rem 0 0.25rem 0"
            }),
            label,
            "\n",
            ...msg
          );
        },
        error: ({ label, msg, scopeLabel }) => {
          if (scopeLabel) {
            console.error(
              "%c%s%s",
              getStyle(
                {
                  textColor: scopeColor ? scopeColor : "transparent",
                  backgroundColor: new TinyColor(scopeColor)
                    .shade(85)
                    .toRgbString() as TRgbColorString,
                  borderColor: scopeColor ? scopeColor : "transparent",
                  margin: "0.15rem 0 0.25rem 0.25rem",
                  padding: "0.2rem 0.35rem 0.15rem 0.35rem"
                },
                true
              ),
              scopeLabel,
              "%c%s",
              getStyle({
                textColor: colors[level](),
                backgroundColor: "transparent",
                borderColor: "transparent",
                margin: "0 0 0 0.35rem",
                padding: "0"
              }),
              label,
              "\n",
              ...msg
            );

            return;
          }
          console.error(
            "%c%s",
            getStyle({
              textColor: colors[level](),
              borderColor: "transparent",
              backgroundColor: "transparent",
              margin: "0 0 0 0.15rem",
              padding: "0.15rem 0 0.25rem 0"
            }),
            label,
            "\n",
            ...msg
          );
        }
      };

      printMsg[level]({ msg, label, scopeLabel });
    }
  }
});

const logWrapper = (
  loggerObject: Logger<TLevels>
): Record<TLevels, (...args: TMsgArray) => void> => ({
  debug: (...args) => loggerObject.debug({ msg: args }),
  log: (...args) => loggerObject.log({ msg: args }),
  success: (...args) => loggerObject.success({ msg: args }),
  assert: (...args) => loggerObject.assert({ msg: args }),
  warn: (...args) => loggerObject.warn({ msg: args }),
  error: (...args) => loggerObject.error({ msg: args })
});

const log = {
  ...logWrapper(logger),
  child: (
    scopeLabel: string,
    scopeColor?: CSSProperties["color"]
  ): ReturnType<typeof logWrapper> => ({
    ...logWrapper(logger.child({ scopeLabel, scopeColor }))
  })
};

export default log;
