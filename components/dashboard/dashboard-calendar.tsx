'use client'

import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarDays } from 'lucide-react'

interface DashboardCalendarProps {
    deadlineDates?: Date[]
}

export function DashboardCalendar({ deadlineDates = [] }: DashboardCalendarProps) {
    const [date, setDate] = useState<Date | undefined>(new Date())

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <CalendarDays className="w-5 h-5 text-blue-600" />
                    Calendar
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex items-stretch p-4 pt-0">
                <div className="dashboard-calendar w-full">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        modifiers={{
                            deadline: deadlineDates,
                        }}
                        modifiersClassNames={{
                            deadline:
                                'bg-red-100 text-red-700 font-semibold rounded-md',
                        }}
                        className="rounded-md !w-full !p-0"
                        classNames={{
                            root: '!w-full',
                            months: '!w-full flex flex-col',
                            month: '!w-full',
                            month_caption: 'mb-1',
                            table: '!w-full border-collapse',
                            weekdays: 'flex !w-full',
                            weekday: 'flex-1 text-center text-muted-foreground text-xs font-medium py-2',
                            week: 'flex !w-full mt-0.5',
                            day: 'flex-1 aspect-square p-0 text-center',
                        }}
                    />
                </div>
            </CardContent>
        </Card>
    )
}
