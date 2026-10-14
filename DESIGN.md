# Aniro website design

## Design read

A full visual overhaul of the Android companion website for Arabic-speaking
users, with an open editorial composition, genuine product screens, and
English available. The page's job is to explain Aniro and lead to the
official APK. Existing anchors, navigation labels, downloads, legal copy,
and the unchanged logo are preserved.

DESIGN_VARIANCE: 7. MOTION_INTENSITY: 4. VISUAL_DENSITY: 3.
Native HTML/CSS/JS is the established stack. This is a custom brand aesthetic,
not an imitation of a named product design system. The explicitly requested
design-taste-frontend skill guides typography, composition, content restraint,
motion, accessibility, and the pre-flight check.

## Audit and decisions

The rejected site repeated a contained phone next to a feature list, hid
important screens behind tabs, and used a large box and a decorative circle
around the capture. Other sections repeated similar card-like groupings.

The hero pairs deliberate two-line typography with the complete Home capture.
The Quran section is a gallery of four actual screens
with captions outside the images; there are no tabs or giant background box.
The daily section has one Azkar composition and two quieter utility views.
The download section uses a broad layout, plain installation instructions,
and short help disclosures. A larger wordmark closes the page.

## Tokens

- Canvas: #0e131b. Surface: #141c27.
- Text: #f3f0e9. Secondary text: #b0bbcb.
- Accent: the existing Aniro amber #ffb52e.
- Arabic: Alexandria. English: Space Grotesk. Both locally hosted.
- Buttons: 10px corners. Feature surface: 20px. Screens: 20-25px.
- Desktop max width: 1240px. Navigation: 76px desktop, 68px mobile.

The brand requests a dark page, so that theme is locked across all sections.
There is no theme inversion, serif insertion, generated product UI, fake
testimonial, invented metric, decoration numbering, or video.

## Screens and motion

Complete screen captures retain the 1080 × 2392 source aspect ratio. Home,
Azkar, Tasbeeh, and Qibla are upright and fully contained. The detached
detail crops and fixed-height Azkar clipping have been removed. None of
the UI content is reconstructed.
The user's real-asset requirement takes precedence over generating images.

The gallery supports native horizontal scrolling, arrow controls, and Home,
End, Left, and Right keys. RTL and LTR use the correct scroll direction.
Controls disappear when all images fit, and disable at each end.

Motion explains entrance hierarchy and acknowledges interaction: hero entry,
small scroll reveals, and button/arrow feedback. No scroll hijacking,
perpetual loops, or decorative status dots. Reduced motion removes movement
and keeps all content visible. Transparency has a solid-fill fallback.

## Pre-flight

- Whole-page overhaul, not a section patch; original routes/anchors retained.
- Headlines and copy fit; desktop hero CTA visible within the first viewport.
- No rejected feature tabs, screenshot background box, videos, or media loads.
- Four Quran screenshots, exact screenshot ratios, no broken local images.
- Full Home/Azkar/Tasbeeh/Qibla screens: no clipping or copy overlap across
  every tested viewport; no screenshot rotation or detached detail crops.
- Download feed validates official GitHub APK URLs and has a working fallback.
- Language switch persists; mobile menu and gallery are keyboard accessible.
- Source filenames and every README image reference verified.
- Arabic and English tested at 320, 390, 768, 1024, and 1440px.
- Hero entry/reveal and dynamic reduced-motion preference tested.
- No em/en-dash separators in visible page copy.
- Contrast, wrapping, touch target, and no-overflow checks recorded by QA.

Visual screenshots are saved during QA. Image output could not be inspected
directly in this tool session; geometric and interaction checks are recorded,
and the user can assess the final aesthetic in the live page.
