#!/usr/bin/env bash

set -euo pipefail

echo '--- Agent Debug Info'
ts-node .buildkite/scripts/lifecycle/print_agent_links.ts || true

IS_TEST_EXECUTION_STEP="$(buildkite-agent meta-data get "${BUILDKITE_JOB_ID}_is_test_execution_step" --default '')"

if [[ "$IS_TEST_EXECUTION_STEP" == "true" ]]; then
  echo "--- Upload Artifacts"
  buildkite-agent artifact upload 'target/junit/**/*'
  buildkite-agent artifact upload 'target/kibana-coverage/jest/**/*'
  buildkite-agent artifact upload 'target/kibana-coverage/functional/**/*'
  buildkite-agent artifact upload 'target/kibana-*'
  buildkite-agent artifact upload 'target/kibana-security-solution/**/*.png'
  buildkite-agent artifact upload 'target/kibana-fleet/**/*.png'
  buildkite-agent artifact upload 'target/test-metrics/*'
  buildkite-agent artifact upload 'target/test-suites-ci-plan.json'
  buildkite-agent artifact upload 'test/**/screenshots/diff/*.png'
  buildkite-agent artifact upload 'test/**/screenshots/failure/*.png'
  buildkite-agent artifact upload 'test/**/screenshots/session/*.png'
  buildkite-agent artifact upload 'test/functional/failure_debug/html/*.html'
  buildkite-agent artifact upload 'x-pack/test/**/screenshots/diff/*.png'
  buildkite-agent artifact upload 'x-pack/test/**/screenshots/failure/*.png'
  buildkite-agent artifact upload 'x-pack/test/**/screenshots/session/*.png'
  buildkite-agent artifact upload 'x-pack/test_serverless/**/screenshots/failure/*.png'
  buildkite-agent artifact upload 'x-pack/test_serverless/**/screenshots/session/*.png'
  buildkite-agent artifact upload 'x-pack/test/functional/apps/reporting/reports/session/*.pdf'
  buildkite-agent artifact upload 'x-pack/test/functional/failure_debug/html/*.html'
  buildkite-agent artifact upload '.es/**/*.hprof'
  buildkite-agent artifact upload 'data/es_debug_*.tar.gz'

  if [[ $BUILDKITE_COMMAND_EXIT_STATUS -ne 0 ]]; then
    echo "--- Run Failed Test Reporter"
    node scripts/report_failed_tests --build-url="${BUILDKITE_BUILD_URL}#${BUILDKITE_JOB_ID}" 'target/junit/**/*.xml'
  fi

  if [[ -d 'target/test_failures' ]]; then
    buildkite-agent artifact upload 'target/test_failures/**/*'
    ts-node .buildkite/scripts/lifecycle/annotate_test_failures.ts
  fi
fi
