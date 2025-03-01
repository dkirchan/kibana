/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { render, screen } from '@testing-library/react';
import { TestProviders } from '../../../common/mock';
import React from 'react';
import { RightPanelContext } from '../context';
import { SessionPreviewContainer } from './session_preview_container';
import { useSessionPreview } from '../hooks/use_session_preview';
import { useLicense } from '../../../common/hooks/use_license';
import { SESSION_PREVIEW_TEST_ID } from './test_ids';
import {
  EXPANDABLE_PANEL_CONTENT_TEST_ID,
  EXPANDABLE_PANEL_HEADER_TITLE_ICON_TEST_ID,
  EXPANDABLE_PANEL_HEADER_TITLE_LINK_TEST_ID,
  EXPANDABLE_PANEL_HEADER_TITLE_TEXT_TEST_ID,
  EXPANDABLE_PANEL_TOGGLE_ICON_TEST_ID,
} from '../../shared/components/test_ids';
import { mockGetFieldsData } from '../mocks/mock_context';

jest.mock('../hooks/use_session_preview');
jest.mock('../../../common/hooks/use_license');

const panelContextValue = {
  dataAsNestedObject: null,
  getFieldsData: mockGetFieldsData,
} as unknown as RightPanelContext;

const sessionViewConfig = {
  index: {},
  sessionEntityId: 'sessionEntityId',
  sessionStartTime: 'sessionStartTime',
};

const TEST_ID = SESSION_PREVIEW_TEST_ID;
const ERROR_TEST_ID = `${SESSION_PREVIEW_TEST_ID}Error`;
const UPSELL_TEST_ID = `${SESSION_PREVIEW_TEST_ID}UpSell`;

const renderSessionPreview = () =>
  render(
    <TestProviders>
      <RightPanelContext.Provider value={panelContextValue}>
        <SessionPreviewContainer />
      </RightPanelContext.Provider>
    </TestProviders>
  );

describe('SessionPreviewContainer', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render component and link in header', () => {
    (useSessionPreview as jest.Mock).mockReturnValue(sessionViewConfig);
    (useLicense as jest.Mock).mockReturnValue({ isEnterprise: () => true });

    const { getByTestId, queryByTestId } = renderSessionPreview();

    expect(getByTestId(TEST_ID)).toBeInTheDocument();
    expect(queryByTestId(ERROR_TEST_ID)).not.toBeInTheDocument();
    expect(queryByTestId(UPSELL_TEST_ID)).not.toBeInTheDocument();
    expect(
      getByTestId(EXPANDABLE_PANEL_HEADER_TITLE_LINK_TEST_ID(SESSION_PREVIEW_TEST_ID))
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId(EXPANDABLE_PANEL_TOGGLE_ICON_TEST_ID(SESSION_PREVIEW_TEST_ID))
    ).not.toBeInTheDocument();
    expect(
      screen.getByTestId(EXPANDABLE_PANEL_HEADER_TITLE_ICON_TEST_ID(SESSION_PREVIEW_TEST_ID))
    ).toBeInTheDocument();
    expect(
      screen.getByTestId(EXPANDABLE_PANEL_CONTENT_TEST_ID(SESSION_PREVIEW_TEST_ID))
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId(EXPANDABLE_PANEL_HEADER_TITLE_TEXT_TEST_ID(SESSION_PREVIEW_TEST_ID))
    ).not.toBeInTheDocument();
  });

  it('should render error message and text in header if no sessionConfig', () => {
    (useSessionPreview as jest.Mock).mockReturnValue(null);
    (useLicense as jest.Mock).mockReturnValue({ isEnterprise: () => true });

    const { getByTestId, queryByTestId } = renderSessionPreview();

    expect(queryByTestId(TEST_ID)).not.toBeInTheDocument();
    expect(getByTestId(ERROR_TEST_ID)).toBeInTheDocument();
    expect(queryByTestId(UPSELL_TEST_ID)).not.toBeInTheDocument();
    expect(
      getByTestId(EXPANDABLE_PANEL_HEADER_TITLE_TEXT_TEST_ID(SESSION_PREVIEW_TEST_ID))
    ).toBeInTheDocument();
  });

  it('should render error message and text in header if no correct license', () => {
    (useSessionPreview as jest.Mock).mockReturnValue(sessionViewConfig);
    (useLicense as jest.Mock).mockReturnValue({ isEnterprise: () => false });

    const { getByTestId, queryByTestId } = renderSessionPreview();

    expect(queryByTestId(TEST_ID)).not.toBeInTheDocument();
    expect(queryByTestId(ERROR_TEST_ID)).not.toBeInTheDocument();
    expect(getByTestId(UPSELL_TEST_ID)).toBeInTheDocument();
    expect(
      getByTestId(EXPANDABLE_PANEL_HEADER_TITLE_TEXT_TEST_ID(SESSION_PREVIEW_TEST_ID))
    ).toBeInTheDocument();
  });
});
