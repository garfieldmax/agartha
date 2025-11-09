-- Seed demo data for Nostra Community platform
-- This file populates the database with comprehensive sample data for all flows

-- ============================================================================
-- MEMBERS (10 users with different levels)
-- ============================================================================
INSERT INTO public.members (id, display_name, avatar_url, level, bio, reputation_score, created_at, updated_at)
VALUES
  ('11111111-1111-4111-8111-111111111111', 'Avery Johnson', null, 'resident', 'Full-stack developer passionate about sustainable living and community tech.', 250, '2024-01-15T12:00:00.000Z', '2024-01-15T12:00:00.000Z'),
  ('22222222-2222-4222-8222-222222222222', 'River Chen', null, 'manager', 'Community organizer and photographer. Building spaces for creative collaboration.', 500, '2024-01-12T12:00:00.000Z', '2024-01-15T12:00:00.000Z'),
  ('33333333-3333-4333-8333-333333333333', 'Marin Ibarra', null, 'guest', 'Music producer exploring co-living spaces. Looking to collaborate on audio projects.', 120, '2024-01-08T12:00:00.000Z', '2024-01-15T12:00:00.000Z'),
  ('44444444-4444-4444-8444-444444444444', 'Taylor Kim', null, 'resident', 'UX designer and sustainability advocate. Love crafting meaningful experiences.', 340, '2024-01-05T12:00:00.000Z', '2024-01-15T12:00:00.000Z'),
  ('55555555-5555-5555-8555-555555555555', 'Jordan Martinez', null, 'manager', 'Maker space coordinator. Expert in woodworking and digital fabrication.', 450, '2024-01-02T12:00:00.000Z', '2024-01-15T12:00:00.000Z'),
  ('66666666-6666-4666-8666-666666666666', 'Casey Williams', null, 'resident', 'Data scientist working remotely. Enthusiastic about community gardens.', 280, '2023-12-28T12:00:00.000Z', '2024-01-15T12:00:00.000Z'),
  ('77777777-7777-4777-8777-777777777777', 'Alex Thompson', null, 'guest', 'Freelance writer and digital nomad. Currently exploring coastal communities.', 150, '2023-12-20T12:00:00.000Z', '2024-01-15T12:00:00.000Z'),
  ('88888888-8888-4888-8888-888888888888', 'Morgan Lee', null, 'in_person', 'Graphic designer and illustrator. Attended the January open house.', 80, '2023-12-15T12:00:00.000Z', '2024-01-15T12:00:00.000Z'),
  ('99999999-9999-4999-8999-999999999999', 'Sam Patel', null, 'resident', 'Software engineer and meditation instructor. Building mindfulness apps.', 310, '2023-12-10T12:00:00.000Z', '2024-01-15T12:00:00.000Z'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'Riley Anderson', null, 'guest', 'Environmental researcher studying urban living systems.', 190, '2023-12-05T12:00:00.000Z', '2024-01-15T12:00:00.000Z')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- COMMUNITIES (2 communities)
-- ============================================================================
INSERT INTO public.communities (id, name, description, created_by, created_at, updated_at)
VALUES
  ('44444444-4444-4444-8444-444444444444', 'Evergreen Co-Living', 'A friendly urban co-living hub with rotating residencies. Focus on sustainable living and community building.', '22222222-2222-4222-8222-222222222222', '2023-12-16T12:00:00.000Z', '2024-01-15T12:00:00.000Z'),
  ('55555555-5555-4555-8555-555555555555', 'Harbor Collective', 'Waterfront makerspace with artist residencies. Equipped with woodshop, studio space, and collaboration areas.', '55555555-5555-5555-8555-555555555555', '2023-12-01T12:00:00.000Z', '2024-01-15T12:00:00.000Z')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- RESIDENCIES (3 residencies)
-- ============================================================================
INSERT INTO public.residencies (id, community_id, name, description, dates, created_at, updated_at)
VALUES
  ('66666666-6666-4666-8666-666666666666', '44444444-4444-4444-8444-444444444444', 'Unit A', 'Two-bedroom corner unit with kitchen and shared living space.', daterange('2024-01-01', '2024-03-31'), '2023-12-31T12:00:00.000Z', '2024-01-15T12:00:00.000Z'),
  ('77777777-7777-4777-8777-777777777777', '44444444-4444-4444-8444-444444444444', 'Studio Loft', 'Sunny loft perfect for short stays. Open plan with skylight.', daterange('2024-02-01', '2024-04-30'), '2024-01-05T12:00:00.000Z', '2024-01-15T12:00:00.000Z'),
  ('88888888-8888-4888-8888-888888888888', '55555555-5555-4555-8555-555555555555', 'Harbor Suite', 'Open floor plan overlooking the marina. Access to all maker facilities.', daterange('2024-01-15', '2024-06-15'), '2023-12-26T12:00:00.000Z', '2024-01-15T12:00:00.000Z')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- PROJECTS (3 projects across both communities)
-- ============================================================================
INSERT INTO public.projects (id, community_id, residency_id, name, description, created_by, created_at, updated_at)
VALUES
  ('aaaa1111-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '44444444-4444-4444-8444-444444444444', '66666666-6666-4666-8666-666666666666', 'Community Garden Initiative', 'Building raised beds and establishing a permaculture garden for the community. Focus on education and sustainable food production.', '11111111-1111-4111-8111-111111111111', '2024-01-10T12:00:00.000Z', '2024-01-15T12:00:00.000Z'),
  ('bbbb2222-bbbb-4bbb-8bbb-bbbbbbbbbbbb', '55555555-5555-4555-8555-555555555555', null, 'Open Source Furniture Designs', 'Collaborative project to design and document modular furniture that can be built in maker spaces. All designs released under Creative Commons.', '55555555-5555-5555-8555-555555555555', '2024-01-08T12:00:00.000Z', '2024-01-15T12:00:00.000Z'),
  ('cccc3333-cccc-4ccc-8ccc-cccccccccccc', '44444444-4444-4444-8444-444444444444', null, 'Community Web Platform', 'Building a web platform to help residents coordinate events, share resources, and stay connected.', '11111111-1111-4111-8111-111111111111', '2024-01-05T12:00:00.000Z', '2024-01-15T12:00:00.000Z')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- PROJECT PARTICIPATION (Members with roles in projects)
-- ============================================================================
INSERT INTO public.project_participation (project_id, member_id, role, status, joined_at)
VALUES
  -- Community Garden Initiative
  ('aaaa1111-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '11111111-1111-4111-8111-111111111111', 'lead', 'active', '2024-01-10T12:00:00.000Z'),
  ('aaaa1111-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '44444444-4444-4444-8444-444444444444', 'contributor', 'active', '2024-01-11T10:00:00.000Z'),
  ('aaaa1111-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '66666666-6666-4666-8666-666666666666', 'contributor', 'active', '2024-01-12T14:00:00.000Z'),
  ('aaaa1111-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 'mentor', 'active', '2024-01-11T16:00:00.000Z'),

  -- Open Source Furniture Designs
  ('bbbb2222-bbbb-4bbb-8bbb-bbbbbbbbbbbb', '55555555-5555-5555-8555-555555555555', 'lead', 'active', '2024-01-08T12:00:00.000Z'),
  ('bbbb2222-bbbb-4bbb-8bbb-bbbbbbbbbbbb', '88888888-8888-4888-8888-888888888888', 'contributor', 'active', '2024-01-09T11:00:00.000Z'),
  ('bbbb2222-bbbb-4bbb-8bbb-bbbbbbbbbbbb', '33333333-3333-4333-8333-333333333333', 'observer', 'active', '2024-01-10T09:00:00.000Z'),

  -- Community Web Platform
  ('cccc3333-cccc-4ccc-8ccc-cccccccccccc', '11111111-1111-4111-8111-111111111111', 'lead', 'active', '2024-01-05T12:00:00.000Z'),
  ('cccc3333-cccc-4ccc-8ccc-cccccccccccc', '44444444-4444-4444-8444-444444444444', 'contributor', 'active', '2024-01-06T10:00:00.000Z'),
  ('cccc3333-cccc-4ccc-8ccc-cccccccccccc', '99999999-9999-4999-8999-999999999999', 'contributor', 'active', '2024-01-07T13:00:00.000Z'),
  ('cccc3333-cccc-4ccc-8ccc-cccccccccccc', '22222222-2222-4222-8222-222222222222', 'mentor', 'active', '2024-01-06T15:00:00.000Z')
ON CONFLICT (project_id, member_id) DO NOTHING;

-- ============================================================================
-- KUDOS (Recognition between members)
-- ============================================================================
INSERT INTO public.kudos (id, from_member_id, to_member_id, project_id, weight, note, created_at)
VALUES
  ('10000000-0000-4000-8000-000000000001', '44444444-4444-4444-8444-444444444444', '11111111-1111-4111-8111-111111111111', 'aaaa1111-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 5, 'Amazing leadership on the garden project! Your vision really brought everyone together.', '2024-01-14T10:00:00.000Z'),
  ('10000000-0000-4000-8000-000000000002', '11111111-1111-4111-8111-111111111111', '66666666-6666-4666-8666-666666666666', 'aaaa1111-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 4, 'Great research on soil composition and planting schedules. Very thorough!', '2024-01-14T11:30:00.000Z'),
  ('10000000-0000-4000-8000-000000000003', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '44444444-4444-4444-8444-444444444444', 'aaaa1111-aaaa-4aaa-8aaa-aaaaaaaaaaaa', 5, 'Your design work is stunning. The garden layout is both beautiful and functional.', '2024-01-14T14:00:00.000Z'),
  ('10000000-0000-4000-8000-000000000004', '88888888-8888-4888-8888-888888888888', '55555555-5555-5555-8555-555555555555', 'bbbb2222-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 5, 'Thank you for the detailed woodworking tutorials. Learned so much!', '2024-01-13T16:00:00.000Z'),
  ('10000000-0000-4000-8000-000000000005', '55555555-5555-5555-8555-555555555555', '88888888-8888-4888-8888-888888888888', 'bbbb2222-bbbb-4bbb-8bbb-bbbbbbbbbbbb', 4, 'Beautiful illustrations for the furniture docs. Really brings the designs to life.', '2024-01-13T17:00:00.000Z'),
  ('10000000-0000-4000-8000-000000000006', '99999999-9999-4999-8999-999999999999', '11111111-1111-4111-8111-111111111111', 'cccc3333-cccc-4ccc-8ccc-cccccccccccc', 5, 'Excellent code architecture. Clean, well-documented, and easy to extend.', '2024-01-12T09:00:00.000Z'),
  ('10000000-0000-4000-8000-000000000007', '44444444-4444-4444-8444-444444444444', '99999999-9999-4999-8999-999999999999', 'cccc3333-cccc-4ccc-8ccc-cccccccccccc', 4, 'Love the UX improvements you suggested. Much more intuitive now!', '2024-01-12T10:30:00.000Z'),
  ('10000000-0000-4000-8000-000000000008', '22222222-2222-4222-8222-222222222222', '11111111-1111-4111-8111-111111111111', 'cccc3333-cccc-4ccc-8ccc-cccccccccccc', 5, 'Impressive work juggling both projects. Your dedication is inspiring!', '2024-01-13T11:00:00.000Z')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- COMMENTS (On various entities)
-- ============================================================================
INSERT INTO public.comments (id, subject_type, subject_ref, author_id, body, created_at)
VALUES
  -- Community comments
  ('20000000-0000-4000-8000-000000000001', 'community', '44444444-4444-4444-8444-444444444444', '22222222-2222-4222-8222-222222222222', 'Weekly dinner went great – lots of new faces and strong feedback on community events.', '2024-01-15T07:00:00.000Z'),
  ('20000000-0000-4000-8000-000000000002', 'community', '44444444-4444-4444-8444-444444444444', '11111111-1111-4111-8111-111111111111', 'Garden project is coming along nicely. Need a few more volunteers for weekend work sessions.', '2024-01-14T16:00:00.000Z'),
  ('20000000-0000-4000-8000-000000000003', 'community', '55555555-5555-4555-8555-555555555555', '55555555-5555-5555-8555-555555555555', 'New laser cutter installed! Training sessions start next week.', '2024-01-13T10:00:00.000Z'),

  -- Residency comments
  ('20000000-0000-4000-8000-000000000004', 'residency', '66666666-6666-4666-8666-666666666666', '11111111-1111-4111-8111-111111111111', 'Heater fixed. Should be much more comfortable now.', '2024-01-15T00:00:00.000Z'),
  ('20000000-0000-4000-8000-000000000005', 'residency', '77777777-7777-4777-8777-777777777777', '44444444-4444-4444-8444-444444444444', 'Guests loved the welcome basket – restocked for next arrival.', '2024-01-14T12:00:00.000Z'),
  ('20000000-0000-4000-8000-000000000006', 'residency', '88888888-8888-4888-8888-888888888888', '77777777-7777-4777-8777-777777777777', 'Amazing views! The marina sunsets are incredible.', '2024-01-13T18:00:00.000Z'),

  -- Member comments
  ('20000000-0000-4000-8000-000000000007', 'member', '33333333-3333-4333-8333-333333333333', '22222222-2222-4222-8222-222222222222', 'Marin is confirming travel – follow up on Monday about studio access.', '2024-01-15T11:30:00.000Z'),
  ('20000000-0000-4000-8000-000000000008', 'member', '88888888-8888-4888-8888-888888888888', '55555555-5555-5555-8555-555555555555', 'Morgan stopped by today. Really impressed with their portfolio work!', '2024-01-14T14:00:00.000Z'),
  ('20000000-0000-4000-8000-000000000009', 'member', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '11111111-1111-4111-8111-111111111111', 'Riley has great insights on sustainability. Would love to collaborate more.', '2024-01-13T15:00:00.000Z'),

  -- Project comments
  ('20000000-0000-4000-8000-00000000000a', 'project', 'aaaa1111-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '66666666-6666-4666-8666-666666666666', 'Soil testing results look good. Ready to start planting next phase.', '2024-01-14T09:00:00.000Z'),
  ('20000000-0000-4000-8000-00000000000b', 'project', 'bbbb2222-bbbb-4bbb-8bbb-bbbbbbbbbbbb', '33333333-3333-4333-8333-333333333333', 'Love the modular design approach. Very flexible!', '2024-01-13T13:00:00.000Z'),
  ('20000000-0000-4000-8000-00000000000c', 'project', 'cccc3333-cccc-4ccc-8ccc-cccccccccccc', '99999999-9999-4999-8999-999999999999', 'API endpoints are all documented. Ready for frontend integration.', '2024-01-12T11:00:00.000Z')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- INTERESTS (Curated interests for discovery)
-- ============================================================================
INSERT INTO public.interests (id, label, kind)
VALUES
  ('30000000-0000-4000-8000-000000000001', 'Web Development', 'skill'),
  ('30000000-0000-4000-8000-000000000002', 'Photography', 'hobby'),
  ('30000000-0000-4000-8000-000000000003', 'Sustainability', 'topic'),
  ('30000000-0000-4000-8000-000000000004', 'Music Production', 'hobby'),
  ('30000000-0000-4000-8000-000000000005', 'Community Building', 'topic'),
  ('30000000-0000-4000-8000-000000000006', 'UX Design', 'skill'),
  ('30000000-0000-4000-8000-000000000007', 'Woodworking', 'hobby'),
  ('30000000-0000-4000-8000-000000000008', 'Data Science', 'skill'),
  ('30000000-0000-4000-8000-000000000009', 'Writing', 'hobby'),
  ('30000000-0000-4000-8000-00000000000a', 'Urban Planning', 'topic')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- MEMBER INTERESTS (Link members to their interests)
-- ============================================================================
INSERT INTO public.member_interests (member_id, interest_id)
VALUES
  -- Avery Johnson
  ('11111111-1111-4111-8111-111111111111', '30000000-0000-4000-8000-000000000001'),
  ('11111111-1111-4111-8111-111111111111', '30000000-0000-4000-8000-000000000003'),
  -- River Chen
  ('22222222-2222-4222-8222-222222222222', '30000000-0000-4000-8000-000000000005'),
  ('22222222-2222-4222-8222-222222222222', '30000000-0000-4000-8000-000000000002'),
  -- Marin Ibarra
  ('33333333-3333-4333-8333-333333333333', '30000000-0000-4000-8000-000000000004'),
  -- Taylor Kim
  ('44444444-4444-4444-8444-444444444444', '30000000-0000-4000-8000-000000000006'),
  ('44444444-4444-4444-8444-444444444444', '30000000-0000-4000-8000-000000000003'),
  -- Jordan Martinez
  ('55555555-5555-5555-8555-555555555555', '30000000-0000-4000-8000-000000000007'),
  ('55555555-5555-5555-8555-555555555555', '30000000-0000-4000-8000-000000000005'),
  -- Casey Williams
  ('66666666-6666-4666-8666-666666666666', '30000000-0000-4000-8000-000000000008'),
  ('66666666-6666-4666-8666-666666666666', '30000000-0000-4000-8000-000000000003'),
  -- Alex Thompson
  ('77777777-7777-4777-8777-777777777777', '30000000-0000-4000-8000-000000000009'),
  ('77777777-7777-4777-8777-777777777777', '30000000-0000-4000-8000-000000000002'),
  -- Morgan Lee
  ('88888888-8888-4888-8888-888888888888', '30000000-0000-4000-8000-000000000006'),
  -- Sam Patel
  ('99999999-9999-4999-8999-999999999999', '30000000-0000-4000-8000-000000000001'),
  -- Riley Anderson
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '30000000-0000-4000-8000-00000000000a'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '30000000-0000-4000-8000-000000000003')
ON CONFLICT (member_id, interest_id) DO NOTHING;

-- ============================================================================
-- MEMBER CONTACTS (Public contact information)
-- ============================================================================
INSERT INTO public.member_contacts (id, member_id, kind, handle, url, is_public, created_at)
VALUES
  ('40000000-0000-4000-8000-000000000001', '11111111-1111-4111-8111-111111111111', 'x', '@averyjohnson', 'https://x.com/averyjohnson', true, '2024-01-15T12:00:00.000Z'),
  ('40000000-0000-4000-8000-000000000002', '11111111-1111-4111-8111-111111111111', 'website', 'averyjohnson.dev', 'https://averyjohnson.dev', true, '2024-01-15T12:00:00.000Z'),
  ('40000000-0000-4000-8000-000000000003', '22222222-2222-4222-8222-222222222222', 'instagram', '@riverchen.photo', 'https://instagram.com/riverchen.photo', true, '2024-01-12T12:00:00.000Z'),
  ('40000000-0000-4000-8000-000000000004', '22222222-2222-4222-8222-222222222222', 'email', 'river@evergreen.community', null, true, '2024-01-12T12:00:00.000Z'),
  ('40000000-0000-4000-8000-000000000005', '33333333-3333-4333-8333-333333333333', 'substack', 'marinmusic', 'https://marinmusic.substack.com', true, '2024-01-08T12:00:00.000Z'),
  ('40000000-0000-4000-8000-000000000006', '44444444-4444-4444-8444-444444444444', 'website', 'taylorkimdesign.com', 'https://taylorkimdesign.com', true, '2024-01-05T12:00:00.000Z'),
  ('40000000-0000-4000-8000-000000000007', '55555555-5555-5555-8555-555555555555', 'instagram', '@jordanmakes', 'https://instagram.com/jordanmakes', true, '2024-01-02T12:00:00.000Z')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- MEMBER GOALS
-- ============================================================================
INSERT INTO public.member_goals (id, member_id, title, details, status, privacy, target_date, created_at, updated_at)
VALUES
  ('50000000-0000-4000-8000-000000000001', '11111111-1111-4111-8111-111111111111', 'Launch personal website', 'Build and deploy a portfolio site showcasing my recent work', 'active', 'public', '2024-03-01', '2024-01-10T12:00:00.000Z', '2024-01-10T12:00:00.000Z'),
  ('50000000-0000-4000-8000-000000000002', '22222222-2222-4222-8222-222222222222', 'Organize monthly community events', 'Plan and host one event per month for community members', 'active', 'public', '2024-12-31', '2024-01-05T12:00:00.000Z', '2024-01-05T12:00:00.000Z'),
  ('50000000-0000-4000-8000-000000000003', '33333333-3333-4333-8333-333333333333', 'Complete music album', 'Finish recording and mixing my first solo album', 'active', 'public', '2024-06-15', '2024-01-08T12:00:00.000Z', '2024-01-08T12:00:00.000Z'),
  ('50000000-0000-4000-8000-000000000004', '44444444-4444-4444-8444-444444444444', 'Complete UX certification', 'Finish advanced UX design course and build case study portfolio', 'active', 'public', '2024-04-30', '2024-01-05T12:00:00.000Z', '2024-01-05T12:00:00.000Z'),
  ('50000000-0000-4000-8000-000000000005', '66666666-6666-4666-8666-666666666666', 'Start community garden', 'Help establish and maintain the community garden project', 'active', 'public', '2024-05-01', '2024-01-12T12:00:00.000Z', '2024-01-12T12:00:00.000Z'),
  ('50000000-0000-4000-8000-000000000006', '99999999-9999-4999-8999-999999999999', 'Launch meditation app', 'Complete MVP and launch to app stores', 'active', 'public', '2024-08-01', '2024-01-10T12:00:00.000Z', '2024-01-10T12:00:00.000Z'),
  ('50000000-0000-4000-8000-000000000007', '77777777-7777-4777-8777-777777777777', 'Publish travel guide', 'Complete manuscript about coastal co-living communities', 'active', 'public', '2024-09-01', '2023-12-20T12:00:00.000Z', '2023-12-20T12:00:00.000Z')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- MEMBER CONNECTIONS (Social graph)
-- ============================================================================
INSERT INTO public.member_connections (from_member_id, to_member_id, relation, status, created_at, responded_at)
VALUES
  ('11111111-1111-4111-8111-111111111111', '22222222-2222-4222-8222-222222222222', 'friend', 'accepted', '2024-01-10T12:00:00.000Z', '2024-01-10T14:00:00.000Z'),
  ('22222222-2222-4222-8222-222222222222', '33333333-3333-4333-8333-333333333333', 'collaborator', 'accepted', '2024-01-11T12:00:00.000Z', '2024-01-11T15:00:00.000Z'),
  ('11111111-1111-4111-8111-111111111111', '33333333-3333-4333-8333-333333333333', 'follow', 'accepted', '2024-01-12T12:00:00.000Z', '2024-01-12T12:00:00.000Z'),
  ('11111111-1111-4111-8111-111111111111', '44444444-4444-4444-8444-444444444444', 'collaborator', 'accepted', '2024-01-11T09:00:00.000Z', '2024-01-11T10:00:00.000Z'),
  ('44444444-4444-4444-8444-444444444444', '66666666-6666-4666-8666-666666666666', 'friend', 'accepted', '2024-01-12T11:00:00.000Z', '2024-01-12T12:00:00.000Z'),
  ('55555555-5555-5555-8555-555555555555', '88888888-8888-4888-8888-888888888888', 'collaborator', 'accepted', '2024-01-09T10:00:00.000Z', '2024-01-09T11:00:00.000Z'),
  ('22222222-2222-4222-8222-222222222222', '55555555-5555-5555-8555-555555555555', 'friend', 'accepted', '2024-01-05T12:00:00.000Z', '2024-01-05T13:00:00.000Z'),
  ('99999999-9999-4999-8999-999999999999', '11111111-1111-4111-8111-111111111111', 'collaborator', 'accepted', '2024-01-07T12:00:00.000Z', '2024-01-07T13:00:00.000Z'),
  ('77777777-7777-4777-8777-777777777777', '22222222-2222-4222-8222-222222222222', 'follow', 'accepted', '2023-12-20T12:00:00.000Z', '2023-12-20T14:00:00.000Z'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '11111111-1111-4111-8111-111111111111', 'collaborator', 'accepted', '2024-01-11T15:00:00.000Z', '2024-01-11T16:00:00.000Z'),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', '66666666-6666-4666-8666-666666666666', 'friend', 'accepted', '2024-01-12T13:00:00.000Z', '2024-01-12T14:00:00.000Z'),
  ('88888888-8888-4888-8888-888888888888', '44444444-4444-4444-8444-444444444444', 'follow', 'accepted', '2023-12-15T12:00:00.000Z', '2023-12-15T13:00:00.000Z')
ON CONFLICT (from_member_id, to_member_id, relation) DO NOTHING;

-- ============================================================================
-- BADGES (Achievement badges that can be awarded)
-- ============================================================================
INSERT INTO public.badges (id, slug, name, description, rarity, icon_url)
VALUES
  ('60000000-0000-4000-8000-000000000001', 'early-adopter', 'Early Adopter', 'One of the first members to join the community', 'rare', null),
  ('60000000-0000-4000-8000-000000000002', 'project-starter', 'Project Starter', 'Initiated a successful community project', 'uncommon', null),
  ('60000000-0000-4000-8000-000000000003', 'kudos-champion', 'Kudos Champion', 'Received 10+ kudos from fellow members', 'common', null),
  ('60000000-0000-4000-8000-000000000004', 'community-builder', 'Community Builder', 'Actively contributes to community growth', 'uncommon', null),
  ('60000000-0000-4000-8000-000000000005', 'collaboration-master', 'Collaboration Master', 'Participated in 3+ projects as a contributor', 'rare', null)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- MEMBER BADGES (Award badges to members)
-- ============================================================================
INSERT INTO public.member_badges (member_id, badge_id, awarded_at, awarded_by, note)
VALUES
  ('11111111-1111-4111-8111-111111111111', '60000000-0000-4000-8000-000000000002', '2024-01-14T12:00:00.000Z', '22222222-2222-4222-8222-222222222222', 'Initiated and is leading two amazing community projects!'),
  ('11111111-1111-4111-8111-111111111111', '60000000-0000-4000-8000-000000000003', '2024-01-14T15:00:00.000Z', '22222222-2222-4222-8222-222222222222', 'Consistently receives positive feedback from team members'),
  ('22222222-2222-4222-8222-222222222222', '60000000-0000-4000-8000-000000000004', '2024-01-13T12:00:00.000Z', '55555555-5555-5555-8555-555555555555', 'Outstanding work organizing events and fostering community spirit'),
  ('44444444-4444-4444-8444-444444444444', '60000000-0000-4000-8000-000000000005', '2024-01-14T10:00:00.000Z', '22222222-2222-4222-8222-222222222222', 'Active contributor in multiple community projects'),
  ('55555555-5555-5555-8555-555555555555', '60000000-0000-4000-8000-000000000002', '2024-01-13T12:00:00.000Z', '22222222-2222-4222-8222-222222222222', 'Started the furniture design project that brought makers together')
ON CONFLICT (member_id, badge_id) DO NOTHING;

