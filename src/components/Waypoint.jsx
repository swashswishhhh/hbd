/**
 * Waypoint.jsx — Interactive 3D node + HTML overlay card.
 *
 * Wraps <Node> (the 3D shape) and adds a Drei <Html> element that
 * renders a glassmorphic DOM card anchored in 3D space.
 */

import { useState, useEffect } from 'react';
import Node from './Node';
import { Html } from '@react-three/drei';

export default function Waypoint({
  id,
  isActive,
  cameraSettled,
  onSelect,
  onClose,
  onSubItemClick,
  content,
  position,
  revealed = true,
  // Pass remaining shape props through to Node
  ...shapeProps
}) {
  const showCard = isActive && cameraSettled;

  const [wishText, setWishText] = useState('');
  const [wishCategory, setWishCategory] = useState('Wish');

  useEffect(() => {
    if (!isActive) {
      setWishText('');
      setWishCategory('Wish');
    }
  }, [isActive]);

  return (
    <>
      {/* ── 3D Shape ── */}
      <Node
        id={id}
        position={position}
        isActive={isActive}
        revealed={revealed}
        onSelect={onSelect}
        onSubItemClick={onSubItemClick}
        {...shapeProps}
      />

      {/* ── HTML Overlay Card ── */}
      {isActive && revealed && (
        <Html
          position={[
            position[0],
            position[1] + 1.8,   // float the card above the shape
            position[2],
          ]}
          center
          zIndexRange={[20, 0]}
          style={{ pointerEvents: showCard ? 'auto' : 'none' }}
        >
          <div
            className={`waypoint-card ${showCard ? 'waypoint-card--visible' : ''}`}
          >
            {/* Close button */}
            <button
              className="waypoint-close"
              onClick={(e) => {
                e.stopPropagation();
                onClose?.();
              }}
              aria-label="Close"
            >
              ✕
            </button>

            {/* Content */}
            <h2 className="waypoint-title">{content?.title}</h2>
            <p className="waypoint-message">{content?.message}</p>

            {/* Voice Trigger Player */}
            {content?.showVoiceTrigger && (
              <div className="voice-trigger-container">
                <button
                  className="voice-play-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSubItemClick?.('voice');
                  }}
                >
                  <span className="voice-play-icon">▶</span> Play Voice Note
                </button>
              </div>
            )}

            {/* Active Voice Player */}
            {content?.isVoicePlay && (
              <div className="voice-player-container">
                <button
                  className="voice-pause-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSubItemClick?.('default');
                  }}
                >
                  <span className="voice-pause-icon">❚❚</span> Stop
                </button>
                <div className="voice-wave">
                  <span className="wave-bar wave-bar-1"></span>
                  <span className="wave-bar wave-bar-2"></span>
                  <span className="wave-bar wave-bar-3"></span>
                  <span className="wave-bar wave-bar-4"></span>
                  <span className="wave-bar wave-bar-5"></span>
                </div>
                <span className="voice-timer">{content.voiceTime || '0:00'}</span>
              </div>
            )}

            {/* ── Wish Jar Content ── */}
            {content?.showWishes && (
              <div className="wishes-list-container">
                {content.wishes && content.wishes.length > 0 ? (
                  content.wishes.map((wish) => (
                    <button
                      key={wish.id}
                      className="wish-btn"
                      style={{ borderLeft: `4px solid ${wish.color || '#ffd4a3'}` }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSubItemClick?.(`view_${wish.id}`);
                      }}
                    >
                      {wish.category === 'Manifestation' ? '✨' : '🌟'} {wish.text.length > 32 ? wish.text.substring(0, 32) + '...' : wish.text}
                    </button>
                  ))
                ) : (
                  <p className="waypoint-message" style={{ fontStyle: 'italic', textAlign: 'center', margin: '8px 0' }}>
                    The jar is currently empty. Fold your first wish inside! 🌟
                  </p>
                )}
                <button
                  className="wish-btn wish-create-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSubItemClick?.('write');
                  }}
                >
                  ➕ Write a Wish / Manifestation
                </button>
              </div>
            )}

            {/* ── Wish Jar Form Content ── */}
            {content?.showWishForm && (
              <div className="capsule-form">
                {/* Category toggle */}
                <div className="wish-category-tabs">
                  <button
                    type="button"
                    className={`wish-category-tab ${wishCategory === 'Wish' ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setWishCategory('Wish');
                    }}
                  >
                    🌟 Wish
                  </button>
                  <button
                    type="button"
                    className={`wish-category-tab ${wishCategory === 'Manifestation' ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setWishCategory('Manifestation');
                    }}
                  >
                    ✨ Manifestation
                  </button>
                </div>

                {/* Textarea input */}
                <textarea
                  className="capsule-textarea"
                  value={wishText}
                  onChange={(e) => setWishText(e.target.value)}
                  placeholder={wishCategory === 'Manifestation' ? "I manifest that in this new year..." : "My birthday wish is..."}
                  maxLength={150}
                  onClick={(e) => e.stopPropagation()} // prevent closing node
                />

                <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.4)', textAlign: 'right', marginTop: '-8px' }}>
                  {wishText.length}/150
                </div>

                <div className="capsule-form-row">
                  <button
                    className="capsule-submit-btn"
                    disabled={!wishText.trim()}
                    style={{ opacity: wishText.trim() ? 1 : 0.5, cursor: wishText.trim() ? 'pointer' : 'not-allowed' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (wishText.trim()) {
                        onSubItemClick?.('add_wish', { text: wishText.trim(), category: wishCategory });
                        setWishText('');
                      }
                    }}
                  >
                    🌟 Fold into Star
                  </button>
                  <button
                    className="capsule-submit-btn back"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSubItemClick?.('default');
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* ── Wish Jar Detail Content ── */}
            {content?.showWishDetail && content?.activeWish && (
              <div className="capsule-actions" style={{ marginTop: '16px' }}>
                <button
                  className="capsule-action-btn"
                  style={{
                    background: 'rgba(231, 76, 60, 0.12)',
                    borderColor: 'rgba(231, 76, 60, 0.3)',
                    color: '#ff7675',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm("Are you sure you want to unfold and remove this star from the jar?")) {
                      onSubItemClick?.('delete_wish', { id: content.activeWish.id });
                    }
                  }}
                >
                  🗑️ Unfold & Remove Star
                </button>
                <button
                  className="capsule-action-btn back"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSubItemClick?.('default');
                  }}
                >
                  ← Back to Jar
                </button>
              </div>
            )}

            {/* ── Coin Fountain Content ── */}
            {content?.showCoinToss && (
              <div className="fountain-container">
                <button
                  className="toss-coin-btn"
                  disabled={content.isTossing}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSubItemClick?.('toss');
                  }}
                >
                  {content.isTossing ? '🪙 Casting...' : '🪙 Toss Lucky Coin'}
                </button>
              </div>
            )}

            {/* ── Jukebox Content ── */}
            {content?.showTracks && (
              <div className="jukebox-controls">
                <div className="track-list">
                  <button
                    className={`track-item ${content.activeTrack === 'track1' ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSubItemClick?.('play_track1');
                    }}
                  >
                    🎵 Close to You - The Carpenters
                  </button>
                  <button
                    className={`track-item ${content.activeTrack === 'track2' ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSubItemClick?.('play_track2');
                    }}
                  >
                    🎵 From the Start - Laufey
                  </button>
                  <button
                    className={`track-item ${content.activeTrack === 'track3' ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSubItemClick?.('play_track3');
                    }}
                  >
                    🎵 Seasons - Wave to Earth
                  </button>
                </div>
                <div className="player-row">
                  {content.activeTrack !== 'none' && (
                    <button
                      className="player-play-pause-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSubItemClick?.('toggle');
                      }}
                    >
                      {content.isPlaying ? '⏸ Pause' : '▶ Play'}
                    </button>
                  )}
                  {content.activeTrack !== 'none' && (
                    <button
                      className="player-stop-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSubItemClick?.('stop');
                      }}
                    >
                      ⏹ Stop
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* ── Chalkboard Menu Board Content ── */}
            {content?.showMenuOptions && (
              <div className="menu-options-container">
                <button
                  className="menu-option-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSubItemClick?.('order_latte');
                  }}
                >
                  ☕ Order Latte
                </button>
                <button
                  className="menu-option-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSubItemClick?.('order_matcha');
                  }}
                >
                  🍵 Order Matcha
                </button>
                <button
                  className="menu-option-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSubItemClick?.('order_macchiato');
                  }}
                >
                  🍮 Order Macchiato
                </button>
                <button
                  className="menu-option-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSubItemClick?.('order_tea');
                  }}
                >
                  🍵 Order Joy Tea
                </button>
              </div>
            )}

            {/* ── Tea Station Clear Tray Action ── */}
            {content?.showClearDrink && (
              <div className="clear-drink-container">
                <button
                  className="clear-drink-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSubItemClick?.('default');
                  }}
                >
                  🧹 Clear Drink Tray
                </button>
              </div>
            )}

            {/* ── Time Capsule Content ── */}
            {content?.showOpenCapsule && (
              <div className="capsule-container">
                <button
                  className="open-capsule-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSubItemClick?.('open');
                  }}
                >
                  🔓 Open Capsule Scroll
                </button>
              </div>
            )}

            {content?.showAddNote && (
              <div className="capsule-actions">
                <button
                  className="capsule-action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSubItemClick?.('add_note');
                  }}
                >
                  ✍️ Write Note to 2031
                </button>
                <button
                  className="capsule-action-btn back"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSubItemClick?.('default');
                  }}
                >
                  ← Back
                </button>
              </div>
            )}

            {content?.showCapsuleForm && (
              <div className="capsule-form">
                <textarea
                  className="capsule-textarea"
                  placeholder="Type a goal or wish for 2031..."
                  onClick={(e) => e.stopPropagation()} // prevent closing node
                />
                <div className="capsule-form-row">
                  <button
                    className="capsule-submit-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSubItemClick?.('note_sealed');
                    }}
                  >
                    🔒 Seal in Capsule
                  </button>
                  <button
                    className="capsule-submit-btn back"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSubItemClick?.('open');
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Generic Sub-item back button */}
            {content?.showBackButton && (
              <button
                className="sub-back-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onSubItemClick?.('default');
                }}
              >
                ← Back
              </button>
            )}

            {/* Photo Slideshow navigation */}
            {content?.showPhotoNav && (
              <div className="photo-nav-container">
                <button
                  className={`photo-nav-dot ${content.activeSlide === 0 ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSubItemClick?.('default');
                  }}
                  title="Photo Wall Overview"
                >
                  1
                </button>
                <button
                  className={`photo-nav-dot ${content.activeSlide === 1 ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSubItemClick?.('photo1');
                  }}
                  title="Han River"
                >
                  2
                </button>
                <button
                  className={`photo-nav-dot ${content.activeSlide === 2 ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSubItemClick?.('photo2');
                  }}
                  title="Cherry Blossoms"
                >
                  3
                </button>
              </div>
            )}

            {/* ── Meditation Zone Controls ── */}
            {content?.showMeditationControls && (
              <div className="meditation-controls">
                <button
                  className="meditation-start-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSubItemClick?.('start_breathe');
                  }}
                >
                  🧘 Start 10s Meditation
                </button>
              </div>
            )}

            {/* ── Meditation Zone Active Progress ── */}
            {content?.showMeditationProgress && (
              <div className="meditation-progress-container">
                <div className={`meditation-phase-text ${content.breathePhase}`}>
                  {content.breathePhase === 'inhale' && '💨 Inhale (4s)...'}
                  {content.breathePhase === 'hold' && '🧘 Hold (2s)...'}
                  {content.breathePhase === 'exhale' && '💨 Exhale (4s)...'}
                </div>
                <div className="meditation-progress-bar">
                  <div
                    className="meditation-progress-fill"
                    style={{ width: `${content.breatheProgress * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* ── Photo Timeline Navigation ── */}
            {content?.showTimelineNav && (
              <div className="timeline-nav-container">
                <button
                  className={`timeline-nav-dot ${content.activeSlide === 0 ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSubItemClick?.('default');
                  }}
                >
                  Cover
                </button>
                <button
                  className={`timeline-nav-dot ${content.activeSlide === 1 ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSubItemClick?.('timeline_childhood');
                  }}
                >
                  Childhood
                </button>
                <button
                  className={`timeline-nav-dot ${content.activeSlide === 2 ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSubItemClick?.('timeline_teenage');
                  }}
                >
                  Teenage
                </button>
                <button
                  className={`timeline-nav-dot ${content.activeSlide === 3 ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSubItemClick?.('timeline_present');
                  }}
                >
                  Present
                </button>
              </div>
            )}
          </div>
        </Html>
      )}
    </>
  );
}
