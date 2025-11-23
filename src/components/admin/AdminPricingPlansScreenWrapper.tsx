import React, { useState } from 'react';
import { AdminPricingPlansScreen, type Plan } from './AdminPricingPlansScreen';
import { AdminCreatePlanScreen } from './AdminCreatePlanScreen';

type ViewMode = 'list' | 'create' | 'edit';

interface AdminPricingPlansScreenWrapperProps {
  isFirstAccess?: boolean;
}

export function AdminPricingPlansScreenWrapper({ isFirstAccess = false }: AdminPricingPlansScreenWrapperProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreatePlan = () => {
    setEditingPlan(null);
    setViewMode('create');
  };

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan(plan);
    setViewMode('edit');
  };

  const handleBack = () => {
    setEditingPlan(null);
    setViewMode('list');
  };

  const handleSave = (plan: Plan) => {
    // After save, increment refresh trigger to reload plans list
    setRefreshTrigger(prev => prev + 1);
    setViewMode('list');
  };

  if (viewMode === 'create' || viewMode === 'edit') {
    return (
      <AdminCreatePlanScreen
        onBack={handleBack}
        onSave={handleSave}
        editingPlan={editingPlan}
      />
    );
  }

  return (
    <AdminPricingPlansScreen
      onCreatePlan={handleCreatePlan}
      onEditPlan={handleEditPlan}
      isFirstAccess={isFirstAccess}
      refreshTrigger={refreshTrigger}
    />
  );
}