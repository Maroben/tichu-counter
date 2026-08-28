import { useEffect, useRef, useState, type PointerEvent } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  Slider,
  Typography,
} from '@mui/material';
import { CloseRounded } from '@mui/icons-material';
import {
  reduceRoundDraft,
  scoreRound,
  type BetDeclaration,
  type PlayerSeat,
  type RoundDraft,
  type SeatIndex,
} from '@tichu/domain';

interface CounterEditorProps {
  readonly draft: RoundDraft;
  readonly seats: readonly PlayerSeat[];
  readonly teamNames: readonly [string, string];
  readonly disabled?: boolean;
  readonly onChange: (draft: RoundDraft) => void;
}

const BetControl = ({
  seat,
  player,
  draft,
  disabled,
  onChange,
}: {
  seat: SeatIndex;
  player: PlayerSeat;
  draft: RoundDraft;
  disabled: boolean;
  onChange: (draft: RoundDraft) => void;
}) => {
  const [open, setOpen] = useState(false);
  const bet = draft.bets[seat];
  const select = (kind: BetDeclaration['kind'], successful: boolean) => {
    onChange(reduceRoundDraft(draft, { type: 'set-bet', seat, bet: { kind, successful } }));
    setOpen(false);
  };
  return (
    <>
      {bet ? (
        <ButtonGroup fullWidth variant="contained" color={bet.successful ? 'primary' : 'secondary'} disabled={disabled}>
          <Button
            aria-label={`Remove ${player.displayName}'s declaration`}
            onClick={() => onChange(reduceRoundDraft(draft, { type: 'remove-bet', seat }))}>
            <CloseRounded />
          </Button>
          <Button fullWidth onClick={() => setOpen(true)}>
            {bet.kind === 'tichu' ? 'Tichu' : 'Grand'} · {bet.successful ? 'win' : 'fail'}
          </Button>
        </ButtonGroup>
      ) : (
        <Button fullWidth variant="outlined" disabled={disabled} onClick={() => setOpen(true)}>
          {player.displayName}
        </Button>
      )}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>{player.displayName}'s declaration</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Choose the call and its result.
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
            {(['tichu', 'grand-tichu'] as const).flatMap((kind) =>
              ([true, false] as const).map((successful) => (
                <Button
                  key={`${kind}-${successful}`}
                  variant="outlined"
                  color={successful ? 'primary' : 'secondary'}
                  onClick={() => select(kind, successful)}>
                  {kind === 'tichu' ? 'Tichu' : 'Grand Tichu'}
                  <br />
                  {successful ? 'Success' : 'Failure'}
                </Button>
              )),
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const sliderValue = (value: number | number[]) => (Array.isArray(value) ? value[0]! : value);
const clampPointValue = (value: number) => Math.min(125, Math.max(-25, value));
const toPointStep = (value: number) => clampPointValue(Math.round(value / 5) * 5);

export const CounterEditor = ({ draft, seats, teamNames, disabled = false, onChange }: CounterEditorProps) => {
  const draggingPoints = useRef(false);
  const currentDraft = useRef(draft);
  const sliderFrame = useRef<HTMLDivElement | null>(null);
  const [localBasePointsTeamB, setLocalBasePointsTeamB] = useState(draft.basePointsTeamB);
  useEffect(() => {
    currentDraft.current = draft;
  }, [draft]);
  useEffect(() => {
    if (!draggingPoints.current) setLocalBasePointsTeamB(draft.basePointsTeamB);
  }, [draft.basePointsTeamB]);
  const displayDraft =
    localBasePointsTeamB === draft.basePointsTeamB
      ? draft
      : reduceRoundDraft(draft, { type: 'set-base-points', teamB: localBasePointsTeamB });
  const basePoints: readonly [number, number] =
    displayDraft.doubleTeam === 0
      ? [200, 0]
      : displayDraft.doubleTeam === 1
        ? [0, 200]
        : [100 - displayDraft.basePointsTeamB, displayDraft.basePointsTeamB];
  const roundPoints = scoreRound(displayDraft);
  const pointValueFromClientX = (clientX: number) => {
    const rect = sliderFrame.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return localBasePointsTeamB;
    return toPointStep(-25 + ((clientX - rect.left) / rect.width) * 150);
  };
  const commitPointValue = (value: number) => {
    const next = toPointStep(value);
    setLocalBasePointsTeamB(next);
    onChange(reduceRoundDraft(currentDraft.current, { type: 'set-base-points', teamB: next }));
  };
  const startPointDrag = (clientX: number) => {
    draggingPoints.current = true;
    setLocalBasePointsTeamB(pointValueFromClientX(clientX));
  };
  const movePointDrag = (clientX: number) => {
    if (!draggingPoints.current) return;
    setLocalBasePointsTeamB(pointValueFromClientX(clientX));
  };
  const finishPointDrag = (clientX: number) => {
    if (!draggingPoints.current) return;
    draggingPoints.current = false;
    commitPointValue(pointValueFromClientX(clientX));
  };
  const startPointPointerDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (disabled || (event.pointerType === 'mouse' && event.button !== 0)) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    startPointDrag(event.clientX);
  };
  const movePointPointerDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!draggingPoints.current) return;
    event.preventDefault();
    movePointDrag(event.clientX);
  };
  const finishPointPointerDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!draggingPoints.current) return;
    event.preventDefault();
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
    finishPointDrag(event.clientX);
  };
  return (
    <Box>
      <Paper sx={{ p: 2.5, mb: 2 }}>
        <Typography variant="overline" color="text.secondary">
          This round
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', textAlign: 'center', gap: 2 }}>
          <Box>
            <Typography variant="h4" color="primary" sx={{ fontWeight: 800 }}>
              {roundPoints[0]}
            </Typography>
            <Typography>{teamNames[0]}</Typography>
          </Box>
          <Box>
            <Typography variant="h4" color="secondary" sx={{ fontWeight: 800 }}>
              {roundPoints[1]}
            </Typography>
            <Typography>{teamNames[1]}</Typography>
          </Box>
        </Box>
      </Paper>
      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h6" sx={{ textAlign: 'center' }}>
          Set points
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', textAlign: 'center', my: 2 }}>
          <Typography variant="h5" color={basePoints[0] >= 50 ? 'primary' : 'secondary'}>
            {basePoints[0]}
          </Typography>
          <Typography variant="h5" color={basePoints[1] >= 50 ? 'primary' : 'secondary'}>
            {basePoints[1]}
          </Typography>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <Button
            disabled={disabled}
            variant={draft.doubleTeam === 0 ? 'contained' : 'outlined'}
            onClick={() => onChange(reduceRoundDraft(draft, { type: 'toggle-double', team: 0 }))}>
            Double
          </Button>
          <Button
            disabled={disabled}
            color="secondary"
            variant={draft.doubleTeam === 1 ? 'contained' : 'outlined'}
            onClick={() => onChange(reduceRoundDraft(draft, { type: 'toggle-double', team: 1 }))}>
            Double
          </Button>
        </Box>
        <Box
          ref={sliderFrame}
          sx={{
            position: 'relative',
            mt: 3,
            px: 1.5,
            touchAction: 'none',
          }}>
          <Slider
            aria-label="Point split"
            disabled={disabled}
            value={localBasePointsTeamB}
            min={-25}
            max={125}
            step={5}
            onChange={(_, value) => {
              const next = sliderValue(value);
              setLocalBasePointsTeamB(next);
              if (!draggingPoints.current) onChange(reduceRoundDraft(draft, { type: 'set-base-points', teamB: next }));
            }}
            onChangeCommitted={(_, value) => commitPointValue(sliderValue(value))}
            valueLabelDisplay="auto"
            sx={{
              pointerEvents: 'none',
              height: 12,
              '& .MuiSlider-thumb': {
                width: 30,
                height: 30,
                bgcolor: 'background.paper',
                border: '3px solid currentColor',
              },
            }}
          />
          <Box
            data-testid="point-slider-frame"
            onPointerDown={startPointPointerDrag}
            onPointerMove={movePointPointerDrag}
            onPointerUp={finishPointPointerDrag}
            onPointerCancel={finishPointPointerDrag}
            sx={{
              position: 'absolute',
              inset: 0,
              cursor: disabled ? 'default' : 'ew-resize',
              zIndex: 1,
            }}
          />
        </Box>
        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" sx={{ textAlign: 'center', mb: 2 }}>
          Make a bet
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          {([0, 1, 2, 3] as SeatIndex[]).map((seat) => (
            <BetControl
              key={seat}
              seat={seat}
              player={seats[seat]!}
              draft={draft}
              disabled={disabled}
              onChange={onChange}
            />
          ))}
        </Box>
      </Paper>
    </Box>
  );
};
