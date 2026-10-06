import { BookMarked, AlertTriangle, CalendarClock, CalendarCheck2 } from 'lucide-react';
import { AppShell } from '@/components/layout/AppShell';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { RecentActivityFeed } from '@/components/dashboard/RecentActivityFeed';
import { SubjectBreakdownBar } from '@/components/dashboard/SubjectBreakdownChart';
import { LowAvailabilityList } from '@/components/dashboard/LowAvailabilityList';
import { getDashboardMetrics, getRecentActivity } from '@/lib/services/dashboardService';
import { getLoans } from '@/lib/data';
import { getBooks } from '@/lib/data';

async function getSubjectBreakdown() {
  const loans = getLoans();
  const books = getBooks();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const counts = new Map<string, number>();
  for (const loan of loans) {
    if (new Date(loan.issuedDate) < thirtyDaysAgo) continue;
    const book = books.find((b) => b.id === loan.bookId);
    if (!book) continue;
    counts.set(book.subject, (counts.get(book.subject) ?? 0) + 1);
  }

  const entries = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  const max = entries.length > 0 ? entries[0][1] : 0;
  return { entries, max };
}

export default async function DashboardPage() {
  const metrics = await getDashboardMetrics();
  const activity = await getRecentActivity(8);
  const { entries, max } = await getSubjectBreakdown();

  return (
    <AppShell title="Дашборд">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard label="Сейчас на руках" value={metrics.currentlyCheckedOut} icon={BookMarked} />
        <MetricCard
          label="Просрочено"
          value={metrics.overdueCount}
          icon={AlertTriangle}
          tone={metrics.overdueCount > 0 ? 'warning' : 'neutral'}
        />
        <MetricCard label="Сдать сегодня" value={metrics.dueTodayCount} icon={CalendarClock} />
        <MetricCard label="Выдано сегодня" value={metrics.issuedTodayCount} icon={CalendarCheck2} tone="good" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded border border-border bg-surface p-5 lg:col-span-2">
          <h2 className="font-serif text-lg text-ink">Активность по предметам (30 дней)</h2>
          <div className="mt-4 space-y-3">
            {entries.length === 0 ? (
              <p className="text-sm text-slate">Недостаточно данных за этот период.</p>
            ) : (
              entries.map(([subject, count]) => (
                <SubjectBreakdownBar key={subject} subject={subject} count={count} max={max} />
              ))
            )}
          </div>
        </div>

        <div className="rounded border border-border bg-surface p-5">
          <h2 className="font-serif text-lg text-ink">Мало экземпляров</h2>
          <div className="mt-4">
            <LowAvailabilityList items={metrics.lowAvailabilityBooks} />
          </div>
        </div>
      </div>

      <div className="mt-6 rounded border border-border bg-surface p-5">
        <h2 className="font-serif text-lg text-ink">Последняя активность</h2>
        <div className="mt-2">
          <RecentActivityFeed events={activity} />
        </div>
      </div>
    </AppShell>
  );
}
