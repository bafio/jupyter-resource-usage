import { ReactWidget } from '@jupyterlab/apputils';

import React, { useState, useEffect, ReactElement } from 'react';

import { IndicatorComponent } from './indicator';

import { ResourceUsage } from './model';

import { formatForDisplay } from './format';

export const DEFAULT_NETWORK_LABEL = 'Net: ';

/**
 * A NetworkView component to display network usage (bytes sent/recv).
 */
const NetworkViewComponent = ({
  model,
  label,
}: {
  model: ResourceUsage.Model;
  label: string;
}): ReactElement => {
  const [text, setText] = useState('');
  const [values, setValues] = useState<number[]>([]);

  const update = (): void => {
    const sent = model.bytesSent;
    const recv = model.bytesRecv;
    const newText = `${formatForDisplay(sent)} / ${formatForDisplay(recv)}`;
    const newValues = model.values.map((value) => value.networkPercent ?? 0);
    setText(newText);
    setValues(newValues);
  };

  useEffect(() => {
    model.stateChanged.connect(update);
    return (): void => {
      model.stateChanged.disconnect(update);
    };
  }, [model]);

  return (
    <IndicatorComponent
      enabled={model.networkAvailable}
      values={values}
      label={label}
      color={'#6a9fb5'}
      text={text}
    />
  );
};

export namespace NetworkView {
  /**
   * Create a new NetworkView React Widget.
   *
   * @param model The resource usage model.
   * @param label The label next to the component.
   */
  export const createNetworkView = (
    model: ResourceUsage.Model,
    label: string
  ): ReactWidget => {
    return ReactWidget.create(
      <NetworkViewComponent model={model} label={label} />
    );
  };
}
