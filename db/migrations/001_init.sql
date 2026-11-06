-- Anonymous results from the "Your turn" chapter. No personal data is stored.
CREATE TABLE play_results (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  created_at  timestamptz NOT NULL DEFAULT now(),
  locale      text        NOT NULL,
  total_score integer     NOT NULL,
  -- [{ opponent, moves: "CCDC…", score, opponentScore }]
  matches     jsonb       NOT NULL
);

CREATE INDEX play_results_created_at_idx ON play_results (created_at);
