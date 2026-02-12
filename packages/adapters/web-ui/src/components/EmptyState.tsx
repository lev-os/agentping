import React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle
} from '@kingly/ui/components';

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
    className?: string;
}

export function EmptyState({
    icon = '∅',
    title,
    description,
    action,
    className = ''
}: EmptyStateProps) {
    return (
        <Card className={className}>
            <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-3 text-2xl" aria-hidden="true">
                    {icon}
                </div>
                <CardTitle className="text-base">{title}</CardTitle>
                {description ? (
                    <CardDescription className="mt-2 max-w-md">
                        {description}
                    </CardDescription>
                ) : null}
                {action ? <div className="mt-4">{action}</div> : null}
            </CardContent>
        </Card>
    );
}
