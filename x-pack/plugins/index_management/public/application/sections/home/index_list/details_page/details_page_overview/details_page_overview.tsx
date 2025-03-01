/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { useState, useMemo } from 'react';
import { i18n } from '@kbn/i18n';
import {
  EuiSpacer,
  EuiPanel,
  EuiFlexGroup,
  EuiFlexItem,
  EuiStat,
  EuiTitle,
  EuiText,
  EuiTextColor,
} from '@elastic/eui';
import {
  CodeBox,
  LanguageDefinition,
  LanguageDefinitionSnippetArguments,
  getLanguageDefinitionCodeSnippet,
  getConsoleRequest,
} from '@kbn/search-api-panels';
import type { Index } from '../../../../../../../common';
import { useAppContext } from '../../../../../app_context';
import { languageDefinitions, curlDefinition } from './languages';

interface Props {
  indexDetails: Index;
}

export const DetailsPageOverview: React.FunctionComponent<Props> = ({ indexDetails }) => {
  const {
    name,
    status,
    documents,
    documents_deleted: documentsDeleted,
    primary,
    replica,
    aliases,
  } = indexDetails;
  const { config, core, plugins } = useAppContext();

  const [selectedLanguage, setSelectedLanguage] = useState<LanguageDefinition>(curlDefinition);

  const elasticsearchURL = useMemo(() => {
    return plugins.cloud?.elasticsearchUrl ?? 'https://your_deployment_url';
  }, [plugins.cloud]);

  const codeSnippetArguments: LanguageDefinitionSnippetArguments = {
    url: elasticsearchURL,
    apiKey: 'your_api_key',
    indexName: name,
  };

  return (
    <>
      <EuiFlexGroup>
        {config.enableIndexStats && (
          <EuiFlexItem data-test-subj="overviewTabIndexStats">
            <EuiPanel>
              <EuiFlexGroup>
                <EuiFlexItem>
                  <EuiStat
                    title={status}
                    titleColor={status === 'open' ? 'success' : 'danger'}
                    description={i18n.translate(
                      'xpack.idxMgmt.indexDetails.overviewTab.statusLabel',
                      {
                        defaultMessage: 'Status',
                      }
                    )}
                  />
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiStat
                    title={documents}
                    titleColor="primary"
                    description={i18n.translate(
                      'xpack.idxMgmt.indexDetails.overviewTab.documentsLabel',
                      {
                        defaultMessage: 'Documents',
                      }
                    )}
                  />
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiStat
                    title={documentsDeleted}
                    description={i18n.translate(
                      'xpack.idxMgmt.indexDetails.overviewTab.documentsDeletedLabel',
                      {
                        defaultMessage: 'Documents deleted',
                      }
                    )}
                  />
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiPanel>
          </EuiFlexItem>
        )}

        <EuiFlexItem data-test-subj="overviewTabIndexDetails">
          <EuiPanel>
            <EuiFlexGroup>
              {primary && (
                <EuiFlexItem>
                  <EuiStat
                    title={primary}
                    description={i18n.translate(
                      'xpack.idxMgmt.indexDetails.overviewTab.primaryLabel',
                      {
                        defaultMessage: 'Primaries',
                      }
                    )}
                  />
                </EuiFlexItem>
              )}

              {replica && (
                <EuiFlexItem>
                  <EuiStat
                    title={replica}
                    description={i18n.translate(
                      'xpack.idxMgmt.indexDetails.overviewTab.replicaLabel',
                      {
                        defaultMessage: 'Replicas',
                      }
                    )}
                  />
                </EuiFlexItem>
              )}

              <EuiFlexItem>
                <EuiStat
                  title={Array.isArray(aliases) ? aliases.length : aliases}
                  description={i18n.translate(
                    'xpack.idxMgmt.indexDetails.overviewTab.aliasesLabel',
                    {
                      defaultMessage: 'Aliases',
                    }
                  )}
                />
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiPanel>
        </EuiFlexItem>
      </EuiFlexGroup>

      <EuiSpacer />

      <EuiFlexGroup direction="column">
        <EuiFlexItem>
          <EuiTitle size="s">
            <h2>
              {i18n.translate('xpack.idxMgmt.indexDetails.overviewTab.addMoreDataTitle', {
                defaultMessage: 'Add more data to this index',
              })}
            </h2>
          </EuiTitle>

          <EuiSpacer size="s" />

          <EuiTextColor color="subdued">
            <EuiText size="s">
              <p>
                {i18n.translate('xpack.idxMgmt.indexDetails.overviewTab.addMoreDataDescription', {
                  defaultMessage:
                    'Keep adding more documents to your already created index using the API',
                })}
              </p>
            </EuiText>
          </EuiTextColor>
        </EuiFlexItem>

        <EuiFlexItem>
          <CodeBox
            languages={languageDefinitions}
            codeSnippet={getLanguageDefinitionCodeSnippet(
              selectedLanguage,
              'ingestDataIndex',
              codeSnippetArguments
            )}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
            assetBasePath={core.http.basePath.prepend(`/plugins/indexManagement/assets`)}
            sharePlugin={plugins.share}
            application={core.application}
            consoleRequest={getConsoleRequest('ingestDataIndex', codeSnippetArguments)}
          />
        </EuiFlexItem>
      </EuiFlexGroup>
    </>
  );
};
