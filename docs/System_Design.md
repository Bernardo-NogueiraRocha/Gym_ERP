# Architectural choices

Based on the stack (mentioned in README), we decided to use a Client/ Server/ Database layered system, in which the layers are:

1) Client Layer (NextJS Client Components)
2) Edge and CDN (Content delivery networks - AWS CloudFront)
3) Application Layer (NextJS Server Actions)
4) Server Cache (Redis/ AWS ElastiCache)
5) Database (PostgreSQL/ AWS RDS)

This architecture is simple, highly reliable, efficient, cloud-based and responsive through live data for Dashboard updates for admins and users.